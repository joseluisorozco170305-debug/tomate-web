import express from 'express';
import crypto from 'node:crypto';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { config, configWarnings, envStatus } from './config.js';
import { db, save } from './db.js';
import { verifySignature } from './instagram.js';
import { handleWebhook, isPaused, schedule, sendManual } from './bot.js';
import { analyzeAndReply } from './ai.js';
import { DEFAULT_SETTINGS } from './defaults.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
app.disable('x-powered-by');

// ─────────────── Webhook de Instagram ───────────────

// 1) Meta verifica tu URL una vez (GET)
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];
  if (mode === 'subscribe' && config.verifyToken && token === config.verifyToken) {
    console.log('✅ Webhook verificado por Meta');
    return res.status(200).send(challenge);
  }
  res.sendStatus(403);
});

// 2) Cada mensaje nuevo llega aquí (POST)
app.post('/webhook', express.raw({ type: '*/*', limit: '2mb' }), (req, res) => {
  const raw = req.body instanceof Buffer ? req.body : Buffer.from('');
  if (!verifySignature(raw, req.get('x-hub-signature-256'))) {
    console.warn('⚠️ Webhook con firma inválida, ignorado');
    return res.sendStatus(401);
  }
  res.sendStatus(200); // Meta quiere respuesta rápida; procesamos después
  try {
    handleWebhook(JSON.parse(raw.toString('utf8')));
  } catch (e) {
    console.error('Webhook ilegible:', e.message);
  }
});

// ─────────────── Panel ───────────────

app.use('/panel', express.static(path.join(__dirname, '..', 'public'), { index: 'panel.html' }));
app.get('/', (_req, res) => res.redirect('/panel'));
app.get('/health', (_req, res) => res.json({ ok: true, bot: db.settings.botEnabled }));

const api = express.Router();
api.use(express.json({ limit: '1mb' }));

api.use((req, res, next) => {
  if (!config.panelPassword) return res.status(503).json({ error: 'Configura PANEL_PASSWORD en el .env' });
  const key = req.get('x-panel-key') || '';
  const a = crypto.createHash('sha256').update(key).digest();
  const b = crypto.createHash('sha256').update(config.panelPassword).digest();
  if (!crypto.timingSafeEqual(a, b)) return res.status(401).json({ error: 'Contraseña incorrecta' });
  next();
});

const summary = (c) => ({
  id: c.id,
  username: c.username,
  name: c.name,
  paused: c.paused,
  pausedUntil: c.pausedUntil,
  isPaused: !!isPaused(c),
  flagged: c.flagged,
  flagReason: c.flagReason,
  unread: c.unread || 0,
  intent: c.analysis?.intencion || null,
  hasLead: Object.values(c.lead || {}).some(Boolean),
  sentiment: c.analysis?.sentimiento || null,
  lastMessage: c.messages.filter((m) => m.from !== 'system').at(-1) || null,
  updatedAt: c.updatedAt,
});

api.get('/state', (_req, res) => {
  const convs = db.listConvs();
  const since = Date.now() - 24 * 3600_000;
  let in24 = 0,
    bot24 = 0;
  for (const c of convs)
    for (const m of c.messages)
      if (m.ts > since) {
        if (m.from === 'user') in24++;
        if (m.from === 'bot') bot24++;
      }
  const intents = {};
  for (const c of convs) if (c.analysis?.intencion) intents[c.analysis.intencion] = (intents[c.analysis.intencion] || 0) + 1;
  res.json({
    settings: db.settings,
    defaults: DEFAULT_SETTINGS,
    warnings: configWarnings(),
    mock: config.aiMock,
    model: config.aiMock ? 'demo' : config.geminiModel,
    stats: {
      chats: convs.length,
      flagged: convs.filter((c) => c.flagged).length,
      paused: convs.filter((c) => isPaused(c)).length,
      in24,
      bot24,
      leads: convs.filter((c) => Object.keys(c.lead || {}).length).length,
      intents,
    },
  });
});

api.get('/conversations', (_req, res) => res.json(db.listConvs().map(summary)));

api.get('/conversations/:id', (req, res) => {
  const c = db.findConv(req.params.id);
  if (!c) return res.status(404).json({ error: 'No existe' });
  c.unread = 0;
  save();
  res.json({ ...summary(c), messages: c.messages, analysis: c.analysis, lead: c.lead, lastError: c.lastError });
});

api.post('/conversations/:id/pause', (req, res) => {
  const c = db.findConv(req.params.id);
  if (!c) return res.status(404).json({ error: 'No existe' });
  c.paused = !!req.body.paused;
  if (!c.paused) c.pausedUntil = null; // reactivar quita también la pausa automática
  save();
  // Si se reactivó y hay mensajes sin contestar, que conteste
  if (!c.paused && c.messages.at(-1)?.from === 'user') schedule(c.id, 1000);
  res.json(summary(c));
});

api.post('/conversations/:id/resolve', (req, res) => {
  const c = db.findConv(req.params.id);
  if (!c) return res.status(404).json({ error: 'No existe' });
  c.flagged = false;
  c.flagReason = null;
  save();
  res.json(summary(c));
});

api.post('/conversations/:id/retry', (req, res) => {
  const c = db.findConv(req.params.id);
  if (!c) return res.status(404).json({ error: 'No existe' });
  // Quita avisos de error al final y vuelve a intentar si lo último es del cliente
  while (c.messages.at(-1)?.from === 'system') c.messages.pop();
  if (c.messages.at(-1)?.from !== 'user') return res.status(400).json({ error: 'El último mensaje ya tiene respuesta' });
  save();
  schedule(c.id, 200);
  res.json({ ok: true });
});

api.post('/conversations/:id/send', async (req, res) => {
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Mensaje vacío' });
  try {
    const c = await sendManual(req.params.id, text);
    res.json(summary(c));
  } catch (e) {
    res.status(502).json({ error: e.message });
  }
});

api.delete('/conversations/:id', (req, res) => {
  db.deleteConv(req.params.id);
  res.json({ ok: true });
});

api.put('/settings', (req, res) => {
  const b = req.body || {};
  const patch = {};
  if ('botEnabled' in b) patch.botEnabled = !!b.botEnabled;
  if ('disclosureEnabled' in b) patch.disclosureEnabled = !!b.disclosureEnabled;
  for (const k of ['debounceSeconds', 'humanTakeoverHours', 'historyLimit'])
    if (k in b) patch[k] = Math.max(0, Math.min(k === 'historyLimit' ? 60 : 168, Number(b[k]) || 0));
  for (const k of ['personality', 'knowledge', 'disclosureText', 'fallbackMessage']) if (k in b) patch[k] = String(b[k]);
  res.json(db.updateSettings(patch));
});

// Simulador: prueba la IA sin tocar Instagram
const sims = new Map();
api.post('/simulate', async (req, res) => {
  const id = String(req.body.sessionId || 'default');
  if (req.body.reset) {
    sims.delete(id);
    return res.json({ ok: true });
  }
  const text = String(req.body.text || '').trim();
  if (!text) return res.status(400).json({ error: 'Escribe algo' });
  const sim = sims.get(id) || { messages: [], lead: {} };
  sim.messages.push({ from: 'user', text, ts: Date.now() });
  try {
    const ai = await analyzeAndReply({ settings: db.settings, conversation: sim, history: sim.messages });
    for (const [k, v] of Object.entries(ai.datos_cliente || {})) if (v) sim.lead[k] = v;
    if (ai.responder && ai.respuesta) sim.messages.push({ from: 'bot', text: ai.respuesta, ts: Date.now() });
    sims.set(id, sim);
    res.json({ ai, lead: sim.lead });
  } catch (e) {
    sim.messages.pop();
    res.status(502).json({ error: e.message });
  }
});

app.use('/api', api);

app.listen(config.port, () => {
  console.log(`\n🍅 Asistente Tomate corriendo en http://localhost:${config.port}`);
  console.log(`   Panel:   http://localhost:${config.port}/panel`);
  console.log(`   Webhook: http://localhost:${config.port}/webhook`);
  if (config.aiMock) console.log('   🧪 Modo demo: la IA está simulada (AI_MOCK=1)');
  if (envStatus.found) console.log(`   📄 Leyendo configuración de: ${envStatus.path}`);
  else console.log(`   ❌ No encontré el archivo .env en ${path.dirname(envStatus.path)}\n      👉 ${envStatus.hint}`);
  for (const w of configWarnings()) console.log('   ⚠️  ' + w);
  console.log('');
});

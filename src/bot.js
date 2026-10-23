// La lógica del asistente: recibe eventos, espera a que la persona termine de escribir,
// analiza con IA y responde solo. Si Tomi entra a contestar a mano, el bot se hace a un lado.
import { db, save } from './db.js';
import { analyzeAndReply } from './ai.js';
import { sendText, senderAction, getProfile, describeMessage } from './instagram.js';

const timers = new Map(); // senderId -> timeout de espera
const busy = new Set(); // chats que se están procesando ahorita
const recentBotTexts = new Map(); // senderId -> [{text, ts}] para reconocer nuestros propios ecos

export function isPaused(c) {
  return c.paused || (c.pausedUntil && c.pausedUntil > Date.now());
}

export function humanTakeover(senderId) {
  const c = db.conv(senderId);
  const hours = Number(db.settings.humanTakeoverHours) || 0;
  if (hours > 0) c.pausedUntil = Date.now() + hours * 3600_000;
  c.flagged = false;
  c.flagReason = null;
  save();
}

function looksLikeOwnEcho(customerId, text) {
  const list = recentBotTexts.get(customerId) || [];
  const now = Date.now();
  return list.some((x) => now - x.ts < 60_000 && text && x.text.startsWith(text.slice(0, 60)));
}

function trackBotText(customerId, text) {
  const list = (recentBotTexts.get(customerId) || []).filter((x) => Date.now() - x.ts < 60_000);
  list.push({ text, ts: Date.now() });
  recentBotTexts.set(customerId, list);
}

// ── Entrada de webhooks ──
export function handleWebhook(body) {
  if (body?.object !== 'instagram') return;
  for (const entry of body.entry || []) {
    const accountId = String(entry.id);
    for (const ev of entry.messaging || []) {
      try {
        handleMessagingEvent(ev, accountId);
      } catch (e) {
        console.error('Error procesando evento:', e);
      }
    }
  }
}

function handleMessagingEvent(ev, accountId) {
  const msg = ev.message || (ev.postback ? { mid: ev.postback.mid, text: ev.postback.title } : null);
  if (!msg || msg.is_deleted || msg.is_unsupported) return;

  // Ecos: mensajes que salieron de TU cuenta (del bot o de ti desde la app)
  if (msg.is_echo || String(ev.sender?.id) === accountId) {
    const customer = String(ev.recipient?.id);
    if (db.isOwnMid(msg.mid) || looksLikeOwnEcho(customer, msg.text)) return; // lo mandó el bot
    if (db.hasMid(customer, msg.mid)) return;
    db.addMessage(customer, { from: 'human', text: describeMessage(msg), mid: msg.mid });
    humanTakeover(customer); // Tomi está contestando: el bot se calla un rato
    cancel(customer);
    console.log(`✋ Tomi contestó a mano a ${customer}; bot en pausa ${db.settings.humanTakeoverHours} h`);
    return;
  }

  const senderId = String(ev.sender.id);
  if (db.hasMid(senderId, msg.mid)) return; // Meta a veces reenvía el mismo webhook

  const c = db.addMessage(senderId, { from: 'user', text: describeMessage(msg), mid: msg.mid });
  c.unread = (c.unread || 0) + 1;
  save();
  ensureProfile(senderId);
  schedule(senderId);
}

async function ensureProfile(senderId) {
  const c = db.conv(senderId);
  if (c.username || c._profileTried) return;
  c._profileTried = true;
  const p = await getProfile(senderId);
  if (p) {
    c.username = p.username || null;
    c.name = p.name || null;
    save();
  }
}

function cancel(senderId) {
  clearTimeout(timers.get(senderId));
  timers.delete(senderId);
}

// Espera unos segundos por si la persona manda varios mensajes seguidos
export function schedule(senderId, delayMs) {
  cancel(senderId);
  const ms = delayMs ?? (Number(db.settings.debounceSeconds) || 0) * 1000;
  timers.set(
    senderId,
    setTimeout(() => {
      timers.delete(senderId);
      processConversation(senderId).catch((e) => console.error('processConversation:', e));
    }, ms),
  );
}

export async function processConversation(senderId) {
  const s = db.settings;
  const c = db.conv(senderId);
  if (!s.botEnabled || isPaused(c)) return;

  const last = c.messages[c.messages.length - 1];
  if (!last || last.from !== 'user') return; // ya se contestó

  if (busy.has(senderId)) return schedule(senderId, 3000);
  busy.add(senderId);

  try {
    senderAction(senderId, 'typing_on');
    const ai = await analyzeAndReply({ settings: s, conversation: c, history: c.messages });

    // Si llegó otro mensaje mientras pensaba, mejor volvemos a analizar con todo
    const now = c.messages[c.messages.length - 1];
    if (now !== last) return schedule(senderId, 1000);
    // Si en lo que pensaba Tomi tomó el control, no mandamos nada
    if (isPaused(c) || !db.settings.botEnabled) return;

    c.analysis = { ...ai, at: Date.now() };
    for (const [k, v] of Object.entries(ai.datos_cliente || {})) if (v && String(v).trim()) c.lead[k] = v;
    c.flagged = !!ai.necesita_humano;
    c.flagReason = ai.necesita_humano ? ai.motivo_humano || 'La IA pidió que lo veas tú' : null;
    c.lastError = null;

    if (ai.responder && ai.respuesta?.trim()) {
      let text = ai.respuesta.trim();
      if (s.disclosureEnabled && !c.disclosed && s.disclosureText?.trim()) {
        text = `${text}\n\n${s.disclosureText.trim()}`;
        c.disclosed = true;
      }
      trackBotText(senderId, text);
      const mids = await sendText(senderId, text);
      mids.forEach((m) => db.rememberMid(m));
      db.addMessage(senderId, { from: 'bot', text, intent: ai.intencion, mid: mids[0] });
    } else {
      db.addMessage(senderId, { from: 'system', text: `El asistente decidió no responder (${ai.intencion}).` });
    }
    c.unread = 0;
    save();
  } catch (e) {
    console.error(`❌ Error con ${senderId}:`, e.message);
    c.lastError = e.message;
    c.flagged = true;
    c.flagReason = 'Error del asistente: ' + e.message.slice(0, 140);
    db.addMessage(senderId, { from: 'system', text: 'Error: ' + e.message.slice(0, 300) });
    const fb = db.settings.fallbackMessage?.trim();
    if (fb && !/Instagram \d+/.test(e.message)) {
      try {
        trackBotText(senderId, fb);
        const mids = await sendText(senderId, fb);
        mids.forEach((m) => db.rememberMid(m));
        db.addMessage(senderId, { from: 'bot', text: fb, intent: 'fallback', mid: mids[0] });
      } catch (e2) {
        console.error('Tampoco se pudo mandar el mensaje de respaldo:', e2.message);
      }
    }
    save();
  } finally {
    busy.delete(senderId);
    senderAction(senderId, 'typing_off');
  }
}

// Mensaje que Tomi manda desde el panel
export async function sendManual(senderId, text) {
  const c = db.findConv(senderId);
  if (!c) throw new Error('Ese chat no existe');
  trackBotText(senderId, text);
  const mids = await sendText(senderId, text);
  mids.forEach((m) => db.rememberMid(m));
  db.addMessage(senderId, { from: 'human', text, mid: mids[0] });
  humanTakeover(senderId);
  cancel(senderId);
  return c;
}

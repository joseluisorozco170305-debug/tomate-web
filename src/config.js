import dotenv from 'dotenv';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Busca el .env en la carpeta del proyecto, sin importar desde dónde corras npm start
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const envPath = path.join(root, '.env');
export const envStatus = { path: envPath, found: fs.existsSync(envPath), hint: null };
if (envStatus.found) {
  dotenv.config({ path: envPath });
} else {
  const files = fs.readdirSync(root);
  if (files.includes('.env.txt')) envStatus.hint = 'Tu archivo se llama ".env.txt": renómbralo a ".env" (sin .txt).';
  else if (files.includes('.env.example')) envStatus.hint = 'Solo existe ".env.example": cópialo o renómbralo como ".env" y llénalo ahí.';
  else envStatus.hint = 'Crea un archivo llamado ".env" en la carpeta del proyecto.';
}

const list = (v, def) =>
  (v ?? def)
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

const demo = process.argv.includes('--demo');

export const config = {
  port: Number(process.env.PORT) || 3000,

  // Instagram
  verifyToken: process.env.IG_VERIFY_TOKEN || '',
  appSecret: process.env.IG_APP_SECRET || '',
  accessToken: process.env.IG_ACCESS_TOKEN || '',
  igUserId: process.env.IG_USER_ID || 'me',
  graphVersion: process.env.IG_GRAPH_VERSION || 'v23.0',
  graphBase: process.env.IG_API_BASE || 'https://graph.instagram.com',

  // Gemini
  geminiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  geminiFallbacks: list(process.env.GEMINI_FALLBACK_MODELS, 'gemini-2.5-flash-lite,gemini-flash-latest'),

  // Panel
  panelPassword: process.env.PANEL_PASSWORD || (demo ? 'tomate' : ''),

  aiMock: demo || process.env.AI_MOCK === '1',
  dataDir: process.env.DATA_DIR || './data',
};

export function configWarnings() {
  const w = [];
  if (!config.verifyToken) w.push('Falta IG_VERIFY_TOKEN: Meta no va a poder verificar tu webhook.');
  if (!config.appSecret) w.push('Falta IG_APP_SECRET: no se valida la firma de los webhooks (inseguro en producción).');
  if (!config.accessToken) w.push('Falta IG_ACCESS_TOKEN: el bot no puede mandar mensajes.');
  if (!config.geminiKey && !config.aiMock) w.push('Falta GEMINI_API_KEY: la IA no va a responder (o pon AI_MOCK=1 para probar).');
  if (!config.panelPassword) w.push('Falta PANEL_PASSWORD: el panel queda bloqueado.');
  return w;
}

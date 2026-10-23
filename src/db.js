// Base de datos mini en un archivo JSON. Sin instalar nada, sin pagar nada.
import fs from 'node:fs';
import path from 'node:path';
import { config } from './config.js';
import { DEFAULT_SETTINGS } from './defaults.js';

const file = path.join(config.dataDir, 'db.json');
let state;

function load() {
  fs.mkdirSync(config.dataDir, { recursive: true });
  try {
    state = JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    state = {};
  }
  state.settings = { ...DEFAULT_SETTINGS, ...(state.settings || {}) };
  state.conversations ||= {};
  state.sentMids ||= [];
}
load();

let saveTimer = null;
export function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(flush, 250);
}
export function flush() {
  clearTimeout(saveTimer);
  const tmp = file + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(state, null, 2));
  fs.renameSync(tmp, file);
}

function newConversation(id) {
  return {
    id,
    username: null,
    name: null,
    paused: false, // pausa manual (hasta que la quites)
    pausedUntil: null, // pausa automática porque Tomi contestó a mano
    flagged: false,
    flagReason: null,
    analysis: null,
    lead: {},
    messages: [],
    unread: 0,
    disclosed: false,
    lastError: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  };
}

export const db = {
  get settings() {
    return state.settings;
  },

  updateSettings(patch) {
    const allowed = Object.keys(DEFAULT_SETTINGS);
    for (const k of allowed) if (k in patch) state.settings[k] = patch[k];
    save();
    return state.settings;
  },

  resetSetting(key) {
    if (key in DEFAULT_SETTINGS) state.settings[key] = DEFAULT_SETTINGS[key];
    save();
    return state.settings;
  },

  conv(id) {
    if (!state.conversations[id]) {
      state.conversations[id] = newConversation(id);
      save();
    }
    return state.conversations[id];
  },

  findConv(id) {
    return state.conversations[id] || null;
  },

  listConvs() {
    return Object.values(state.conversations).sort((a, b) => b.updatedAt - a.updatedAt);
  },

  addMessage(id, msg) {
    const c = db.conv(id);
    c.messages.push({ ts: Date.now(), ...msg });
    if (c.messages.length > 300) c.messages = c.messages.slice(-300);
    c.updatedAt = Date.now();
    save();
    return c;
  },

  hasMid(id, mid) {
    if (!mid) return false;
    const c = state.conversations[id];
    return !!c && c.messages.some((m) => m.mid === mid);
  },

  rememberMid(mid) {
    if (!mid) return;
    state.sentMids.push(mid);
    if (state.sentMids.length > 1000) state.sentMids = state.sentMids.slice(-1000);
    save();
  },

  isOwnMid(mid) {
    return !!mid && state.sentMids.includes(mid);
  },

  deleteConv(id) {
    delete state.conversations[id];
    save();
  },
};

process.on('SIGINT', () => {
  flush();
  process.exit(0);
});
process.on('SIGTERM', () => {
  flush();
  process.exit(0);
});

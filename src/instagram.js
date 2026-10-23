// Todo lo que habla con la API oficial de Instagram (graph.instagram.com)
import crypto from 'node:crypto';
import { config } from './config.js';

const base = () => `${config.graphBase}/${config.graphVersion}`;

// Instagram corta en 1000 caracteres, así que partimos mensajes largos
function splitText(text, max = 950) {
  const out = [];
  let rest = text.trim();
  while (rest.length > max) {
    let cut = rest.lastIndexOf('\n', max);
    if (cut < max * 0.5) cut = rest.lastIndexOf('. ', max) + 1;
    if (cut < max * 0.5) cut = rest.lastIndexOf(' ', max);
    if (cut <= 0) cut = max;
    out.push(rest.slice(0, cut).trim());
    rest = rest.slice(cut).trim();
  }
  if (rest) out.push(rest);
  return out;
}

async function post(body) {
  const res = await fetch(`${base()}/${config.igUserId}/messages`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${config.accessToken}` },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(15000),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(`Instagram ${res.status}: ${data?.error?.message || JSON.stringify(data)}`);
  return data;
}

export async function sendText(recipientId, text) {
  if (!config.accessToken) throw new Error('No hay IG_ACCESS_TOKEN configurado');
  const mids = [];
  for (const chunk of splitText(text)) {
    const data = await post({ recipient: { id: recipientId }, message: { text: chunk } });
    if (data.message_id) mids.push(data.message_id);
  }
  return mids;
}

// "Escribiendo..." para que se sienta más humano. Si falla, ni pedo.
export async function senderAction(recipientId, action) {
  if (!config.accessToken) return;
  try {
    await post({ recipient: { id: recipientId }, sender_action: action });
  } catch {
    /* no pasa nada */
  }
}

export async function getProfile(igsid) {
  if (!config.accessToken) return null;
  try {
    const url = `${base()}/${igsid}?fields=name,username&access_token=${encodeURIComponent(config.accessToken)}`;
    const res = await fetch(url, { signal: AbortSignal.timeout(10000) });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export function verifySignature(rawBody, header) {
  if (!config.appSecret) return true; // sin secreto no se puede validar (avisamos al arrancar)
  if (!header || !header.startsWith('sha256=')) return false;
  const expected = crypto.createHmac('sha256', config.appSecret).update(rawBody).digest('hex');
  const got = header.slice(7);
  if (got.length !== expected.length) return false;
  return crypto.timingSafeEqual(Buffer.from(got, 'hex'), Buffer.from(expected, 'hex'));
}

// Convierte adjuntos en texto que la IA pueda entender
export function describeMessage(msg) {
  const parts = [];
  if (msg.text) parts.push(msg.text);
  for (const a of msg.attachments || []) {
    const type = a.type || 'archivo';
    const map = {
      image: '[mandó una imagen]',
      video: '[mandó un video]',
      audio: '[mandó un audio de voz]',
      file: '[mandó un archivo]',
      share: '[compartió una publicación]',
      ig_post: '[compartió una publicación]',
      ig_reel: '[compartió un reel]',
      reel: '[compartió un reel]',
      story_mention: '[te mencionó en su historia]',
      animated_image: '[mandó un GIF/sticker]',
    };
    parts.push(map[type] || `[mandó un adjunto: ${type}]`);
  }
  if (msg.reply_to?.story) parts.unshift('[respondió a tu historia]');
  return parts.join(' ').trim() || '[mensaje sin texto]';
}

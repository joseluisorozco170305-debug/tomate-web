// El cerebro: le pasa la conversación a Gemini, que analiza y propone respuesta en JSON.
import { config } from './config.js';

export const INTENTS = [
  'saludo',
  'info_paquetes',
  'cotizacion',
  'dudas_proceso',
  'portafolio',
  'soporte_cliente',
  'colaboracion',
  'queja',
  'personal',
  'spam',
  'otro',
];

export const PACKAGES = ['ninguno', 'pa_que_te_organices', 'pa_que_lo_controles', 'pa_que_mejoren_las_ventas'];

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    intencion: { type: 'STRING', enum: INTENTS },
    resumen: { type: 'STRING', description: 'Qué quiere la persona, en una frase' },
    sentimiento: { type: 'STRING', enum: ['positivo', 'neutral', 'negativo'] },
    urgencia: { type: 'STRING', enum: ['baja', 'media', 'alta'] },
    paquete_sugerido: { type: 'STRING', enum: PACKAGES },
    necesita_humano: { type: 'BOOLEAN' },
    motivo_humano: { type: 'STRING' },
    datos_cliente: {
      type: 'OBJECT',
      properties: {
        nombre: { type: 'STRING' },
        negocio: { type: 'STRING' },
        necesidad: { type: 'STRING' },
        presupuesto: { type: 'STRING' },
      },
    },
    responder: { type: 'BOOLEAN' },
    respuesta: { type: 'STRING' },
  },
  required: ['intencion', 'resumen', 'sentimiento', 'urgencia', 'paquete_sugerido', 'necesita_humano', 'responder', 'respuesta'],
  propertyOrdering: [
    'intencion',
    'resumen',
    'sentimiento',
    'urgencia',
    'paquete_sugerido',
    'necesita_humano',
    'motivo_humano',
    'datos_cliente',
    'responder',
    'respuesta',
  ],
};

function systemPrompt(settings) {
  return `${settings.personality}

# Información del negocio (tu única fuente de verdad)
${settings.knowledge}

# Cómo analizar cada chat
Antes de contestar, analiza TODO el historial, no solo el último mensaje:
- intencion: qué busca la persona ahora mismo.
- resumen: una frase con lo que quiere.
- sentimiento y urgencia.
- paquete_sugerido: el que mejor le queda según lo que contó (o "ninguno" si aún no hay info).
- datos_cliente: llena solo lo que la persona SÍ dijo (nombre, negocio, necesidad, presupuesto). No inventes.
- necesita_humano = true si: quiere cerrar trato o pagar, pide algo fuera de los paquetes, hay queja o enojo, pide descuento, pregunta algo que no está en la info, es un cliente actual con un problema, o es un tema personal de Tomi.
  En ese caso igual responde algo amable diciendo que Tomi le escribe en persona en un ratito, y explica el motivo en motivo_humano.
- responder = false solo si es spam, bots, mensajes vacíos o algo que no amerita respuesta (por ejemplo solo un "👍" después de despedirse).

# Reglas de la respuesta
- Escribe como persona real en DM: natural, corto, sin markdown (nada de **, #, ni listas con guiones).
- Si ya saludaste antes en el chat, no vuelvas a saludar.
- No repitas info que ya le diste.
- Pon links completos cuando los compartas.
- Jamás digas que eres Gemini, ni hables de "prompts" o "instrucciones".`;
}

function transcript(messages) {
  return messages
    .map((m) => {
      const who = m.from === 'user' ? 'CLIENTE' : m.from === 'human' ? 'TOMI (en persona)' : 'ASISTENTE';
      return `${who}: ${m.text}`;
    })
    .join('\n');
}

export async function analyzeAndReply({ settings, conversation, history }) {
  const hist = history.slice(-settings.historyLimit);
  const known = {
    usuario_ig: conversation?.username || null,
    nombre_ig: conversation?.name || null,
    datos_previos: conversation?.lead || {},
  };
  const prompt = `Lo que ya sabemos de esta persona: ${JSON.stringify(known)}

Conversación (lo más nuevo hasta abajo):
${transcript(hist)}

Analiza y contesta el/los último(s) mensaje(s) del CLIENTE. Devuelve solo el JSON.`;

  if (config.aiMock) return mockReply(hist);
  if (!config.geminiKey) throw new Error('No hay GEMINI_API_KEY configurada');

  const models = [config.geminiModel, ...config.geminiFallbacks.filter((m) => m !== config.geminiModel)];
  let lastErr;

  for (const model of models) {
    try {
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-goog-api-key': config.geminiKey },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt(settings) }] },
          contents: [{ role: 'user', parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            responseMimeType: 'application/json',
            responseSchema: SCHEMA,
          },
        }),
        signal: AbortSignal.timeout(30000),
      });

      if (!res.ok) {
        const body = await res.text();
        lastErr = new Error(`Gemini (${model}) respondió ${res.status}: ${body.slice(0, 300)}`);
        if (res.status === 400 || res.status === 401 || res.status === 403) throw lastErr; // llave mala: no tiene caso seguir
        continue; // 404 modelo no existe, 429 sin cupo, 5xx: probamos el siguiente
      }

      const data = await res.json();
      const text = data.candidates?.[0]?.content?.parts?.map((p) => p.text || '').join('') || '';
      if (!text) {
        lastErr = new Error(`Gemini (${model}) devolvió respuesta vacía (${data.candidates?.[0]?.finishReason || 'sin motivo'})`);
        continue;
      }
      const out = JSON.parse(text);
      out.respuesta = cleanReply(out.respuesta || '');
      out.model = model;
      return out;
    } catch (e) {
      lastErr = e;
      if (/respondió (400|401|403)/.test(e.message)) break;
    }
  }
  throw lastErr || new Error('No se pudo obtener respuesta de Gemini');
}

// Quita markdown que se cuele, porque en IG se ve feo
function cleanReply(t) {
  return t
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/^#+\s*/gm, '')
    .replace(/^\s*[-*]\s+/gm, '• ')
    .trim();
}

// ── Modo demo: respuestas de mentiritas para probar sin Gemini ──
function mockReply(hist) {
  const last = [...hist].reverse().find((m) => m.from === 'user')?.text?.toLowerCase() || '';
  const base = {
    sentimiento: 'neutral',
    urgencia: 'baja',
    paquete_sugerido: 'ninguno',
    necesita_humano: false,
    motivo_humano: '',
    datos_cliente: {},
    responder: true,
    model: 'demo',
  };
  if (/precio|cu[aá]nto|cuesta|cotiza|paquete/.test(last))
    return {
      ...base,
      intencion: 'info_paquetes',
      resumen: 'Pregunta por precios de los paquetes',
      sentimiento: 'positivo',
      urgencia: 'media',
      respuesta:
        'Tenemos 3 paquetes: desde $800 con "Pa\' que te organices" hasta $1,500 con "Pa\' que mejoren las ventas" (incluye estampas NFC). ¿Qué tipo de negocio tienes? Así te digo cuál te queda mejor 🍅',
    };
  if (/pagar|transfer|dep[oó]sito|descuento|enojad|mal servicio/.test(last))
    return {
      ...base,
      intencion: /descuento/.test(last) ? 'cotizacion' : 'queja',
      resumen: 'Tema que debe ver Tomi en persona',
      sentimiento: /enojad|mal/.test(last) ? 'negativo' : 'neutral',
      urgencia: 'alta',
      necesita_humano: true,
      motivo_humano: 'Pago, descuento o queja',
      respuesta: 'Va, esto lo ve Tomi directamente, te escribe en un ratito para darte seguimiento 🙌',
    };
  if (/^(hola|buenas|hey|que onda|qué onda)/.test(last))
    return {
      ...base,
      intencion: 'saludo',
      resumen: 'Saludo inicial',
      respuesta: '¡Qué onda! Bienvenid@ a Tomate 🍅 ¿En qué te ayudamos? ¿Buscas una página para tu negocio?',
    };
  if (/^(👍|ok|va|gracias)$/.test(last.trim()))
    return { ...base, intencion: 'otro', resumen: 'Cierre de conversación', responder: false, respuesta: '' };
  return {
    ...base,
    intencion: 'otro',
    resumen: 'Mensaje general',
    respuesta: 'Te leo 👀 Cuéntame un poco más de tu negocio y lo que te gustaría tener en tu página.',
  };
}

// Server-side Sanne: realtime sollicitatie-interview proxy.
// The browser opens a WebSocket to /api/sollicitatie; this proxies bidirectionally
// to Azure OpenAI Realtime, injecting the difficulty-specific Sanne prompt and
// handling the advance_to_step / end_interview tool calls. The Azure key stays
// server-side. end_interview now returns five sub-scores; the final grade,
// difficulty bonus and leaderboard points are derived here.

const crypto = require('crypto');
const { WebSocketServer, WebSocket } = require('ws');

// Difficulty-keyed prompts: { easy|medium|hard: { nl, en, es } }.
const PROMPTS = require('./sanne_prompts.json');

const REALTIME_ENDPOINT   = (process.env.AZURE_REALTIME_ENDPOINT || '').replace(/\/+$/, '');
const REALTIME_API_KEY    = process.env.AZURE_REALTIME_API_KEY || '';
const REALTIME_DEPLOYMENT = process.env.AZURE_REALTIME_DEPLOYMENT || 'gpt-realtime-1.5';
const REALTIME_API_VER    = process.env.AZURE_REALTIME_API_VERSION || '2024-10-01-preview';
const REALTIME_VOICE      = process.env.AZURE_REALTIME_VOICE || 'shimmer';
const REALTIME_API        = (process.env.REALTIME_API || '').toLowerCase(); // 'v1' opts into the gpt-realtime-2 schema

const VALID_LANGS = new Set(['nl', 'en', 'es']);
const VALID_DIFF  = new Set(['easy', 'medium', 'hard']);

// Difficulty-weighted blend of the five sub-scores → final grade.
const WEIGHTS = {
  easy:   { clarity: 0.30, motivation: 0.30, customer_focus: 0.15, availability: 0.10, examples: 0.15 },
  medium: { clarity: 0.20, motivation: 0.20, customer_focus: 0.25, availability: 0.15, examples: 0.20 },
  hard:   { clarity: 0.15, motivation: 0.20, customer_focus: 0.30, availability: 0.15, examples: 0.20 },
};
const DIFF_BONUS = { easy: 0.0, medium: 0.5, hard: 1.2 };

function pickPrompt(diff, lang) {
  const byDiff = PROMPTS[diff] || PROMPTS.medium || {};
  return byDiff[lang] || byDiff.nl || (PROMPTS.medium && PROMPTS.medium.nl) || '';
}

const GREET = {
  nl: 'Start het gesprek nu. Roep eerst de tool advance_to_step met step=1. Daarna spreek je je warme welkomstgroet uit als Sanne: stel jezelf kort voor als bedrijfsleider bij Albert Heijn en vraag hoe de kandidaat heet. Kort, B1-Nederlands, max 2 zinnen, geen JSON.',
  en: 'Start the interview now. First call the advance_to_step tool with step=1. Then speak your warm welcome as Sanne: briefly introduce yourself as the Albert Heijn store manager and ask the candidate\'s name. Short, plain English, max 2 sentences, no JSON.',
  es: 'Comienza la entrevista ahora. Primero llama a la herramienta advance_to_step con step=1. Luego da tu cálida bienvenida como Sanne: preséntate brevemente como gerente de Albert Heijn y pregunta el nombre del candidato. Corto, español sencillo, máximo 2 oraciones, sin JSON.',
};

const END_INSTRUCTIONS = {
  nl: 'Het gesprek is nu klaar. Lees de volgende samenvatting rustig en warm hardop voor, in je rol als Sanne. Korte B1-zinnen, geen JSON, geen accolades. Samenvatting: ',
  en: 'The interview is now finished. Read the following summary calmly and warmly aloud, in your role as Sanne. Short plain sentences, no JSON, no curly braces. Summary: ',
  es: 'La entrevista ha terminado. Lee el siguiente resumen con calma y calidez en voz alta, en tu papel de Sanne. Frases cortas y sencillas, sin JSON, sin llaves. Resumen: ',
};

const DISCONNECT_ERRORS = {
  nl: 'Verbinding met Sanne is verbroken. Probeer het opnieuw.',
  en: 'Connection with Sanne was lost. Please try again.',
  es: 'Se ha perdido la conexión con Sanne. Por favor, inténtalo de nuevo.',
};

const TOOLS = [
  {
    type: 'function',
    name: 'advance_to_step',
    description: 'Call this whenever Sanne moves the interview forward to a new step. Must be called ONCE per step, BEFORE speaking the main question of that step, including step 1 at the very start.',
    parameters: {
      type: 'object',
      properties: { step: { type: 'integer', minimum: 1, maximum: 5, description: 'The new step number (1-5).' } },
      required: ['step'],
    },
  },
  {
    type: 'function',
    name: 'end_interview',
    description: 'Call this exactly once at the very end, after step 5, to finish the interview.',
    parameters: {
      type: 'object',
      properties: {
        scores: {
          type: 'object',
          properties: {
            clarity:        { type: 'number', minimum: 0, maximum: 10 },
            motivation:     { type: 'number', minimum: 0, maximum: 10 },
            customer_focus: { type: 'number', minimum: 0, maximum: 10 },
            availability:   { type: 'number', minimum: 0, maximum: 10 },
            examples:       { type: 'number', minimum: 0, maximum: 10 },
          },
          required: ['clarity', 'motivation', 'customer_focus', 'availability', 'examples'],
        },
        positives:      { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 4 },
        improvements:   { type: 'array', items: { type: 'string' }, minItems: 2, maxItems: 4 },
        summary:        { type: 'string', description: 'A short spoken summary (2-4 short sentences) Sanne reads aloud.' },
        candidate_name: { type: 'string', description: 'As stated by the candidate in step 1; empty if unsure.' },
      },
      required: ['scores', 'positives', 'improvements', 'summary', 'candidate_name'],
    },
  },
];

function upstreamUrl() {
  // Prefer the explicit full URL from AZURE_REALTIME_URL (the gpt-realtime-2
  // pattern: https://.../openai/v1/realtime?model=gpt-realtime-2). Falls back
  // to the old endpoint+deployment+api-version pattern for backwards compat.
  const direct = (process.env.AZURE_REALTIME_URL || '').trim();
  if (direct) return direct.replace(/^https?:\/\//, 'wss://');
  const host = REALTIME_ENDPOINT.replace(/^https?:\/\//, '');
  return `wss://${host}/openai/realtime?api-version=${encodeURIComponent(REALTIME_API_VER)}&deployment=${encodeURIComponent(REALTIME_DEPLOYMENT)}`;
}

// ── session.update — preview (gpt-realtime-1.5) schema ──
function sessionUpdate(lang, ptt, diff) {
  return JSON.stringify({
    type: 'session.update',
    session: {
      modalities: ['audio', 'text'],
      voice: REALTIME_VOICE,
      instructions: pickPrompt(diff, lang),
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: { model: 'whisper-1', language: lang },
      temperature: 0.6,
      max_response_output_tokens: 1000,
      tools: TOOLS,
      tool_choice: 'auto',
      turn_detection: ptt ? null : {
        type: 'server_vad',
        threshold: 0.5,
        prefix_padding_ms: 300,
        silence_duration_ms: 700,
        create_response: true,
        interrupt_response: false,
      },
    },
  });
}

// ── session.update — v1 (gpt-realtime-2) schema. Gated by REALTIME_API=v1. ──
// Refined against the live endpoint in the migration task; output_modalities,
// audio.input/output sub-objects, session.type.
function sessionUpdateV1(lang, ptt, diff) {
  return JSON.stringify({
    type: 'session.update',
    session: {
      type: 'realtime',
      instructions: pickPrompt(diff, lang),
      output_modalities: ['audio'],
      audio: {
        input: {
          format: { type: 'audio/pcm', rate: 24000 },
          transcription: { model: 'whisper-1', language: lang },
          turn_detection: ptt ? null : {
            type: 'server_vad', threshold: 0.5, prefix_padding_ms: 300, silence_duration_ms: 700,
            create_response: true, interrupt_response: false,
          },
        },
        output: { format: { type: 'audio/pcm', rate: 24000 }, voice: REALTIME_VOICE },
      },
      tools: TOOLS,
      tool_choice: 'auto',
      max_output_tokens: 1000,
    },
  });
}

function buildSession(lang, ptt, diff) {
  return REALTIME_API === 'v1' ? sessionUpdateV1(lang, ptt, diff) : sessionUpdate(lang, ptt, diff);
}

function greetNow(lang) {
  // v1 forbids `modalities` on response.create (it lives at session level).
  const response = REALTIME_API === 'v1'
    ? { instructions: GREET[lang] || GREET.nl }
    : { modalities: ['audio', 'text'], instructions: GREET[lang] || GREET.nl };
  return JSON.stringify({ type: 'response.create', response });
}

function round1(n) { return Math.round(n * 10) / 10; }

function deriveResult(parsed, diff, openedAt) {
  const s = parsed.scores || {};
  const w = WEIGHTS[diff] || WEIGHTS.medium;
  const sv = (k) => {
    const n = Number(s[k]);
    return Number.isFinite(n) ? Math.max(0, Math.min(10, n)) : 0;
  };
  const grade = round1(
    sv('clarity') * w.clarity + sv('motivation') * w.motivation +
    sv('customer_focus') * w.customer_focus + sv('availability') * w.availability +
    sv('examples') * w.examples
  );
  const bonus = DIFF_BONUS[diff] != null ? DIFF_BONUS[diff] : 0;
  return {
    scores: {
      clarity: round1(sv('clarity')), motivation: round1(sv('motivation')),
      customer_focus: round1(sv('customer_focus')), availability: round1(sv('availability')),
      examples: round1(sv('examples')),
    },
    grade,
    accepted: grade >= 5.5,
    difficulty: diff,
    difficulty_bonus: bonus,
    leaderboard_points: round1(grade + bonus),
    duration_seconds: Math.max(0, Math.floor((Date.now() - openedAt) / 1000)),
    candidate_name: (typeof parsed.candidate_name === 'string' ? parsed.candidate_name : '').slice(0, 40).trim(),
    positives: Array.isArray(parsed.positives) ? parsed.positives.slice(0, 4) : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements.slice(0, 4) : [],
    summary: (parsed.summary || '').trim(),
    id: crypto.randomBytes(8).toString('hex'),
    timestamp: new Date().toISOString(),
  };
}

function fallbackSummary(lang, grade, accepted) {
  const g = grade.toFixed(1).replace('.', ',');
  if (lang === 'en') {
    return accepted ? `Thank you for the interview. Your score is ${grade.toFixed(1)}. Well done. You got the job!`
                    : `Thank you for the interview. Your score is ${grade.toFixed(1)}. Not quite this time. Keep practising.`;
  }
  if (lang === 'es') {
    return accepted ? `Gracias por la entrevista. Tu puntuación es ${g}. ¡Muy bien! ¡Estás contratado/a!`
                    : `Gracias por la entrevista. Tu puntuación es ${g}. Esta vez no ha sido suficiente. Sigue practicando.`;
  }
  return accepted ? `Bedankt voor het gesprek. Je krijgt een ${g}. Dat is mooi. Je bent aangenomen. Heel goed gedaan.`
                  : `Bedankt voor het gesprek. Je krijgt een ${g}. Nog niet genoeg deze keer. Blijf oefenen, je komt er wel.`;
}

function attachSollicitatie(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; } catch (e) { pathname = req.url; }
    if (pathname === '/api/sollicitatie') {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
    }
    // other paths (incl. /api/trivia) are handled by their own upgrade listeners
  });

  wss.on('connection', (browser, req) => {
    const qs = new URL(req.url, 'http://localhost').searchParams;
    let lang = (qs.get('lang') || 'nl').toLowerCase();
    if (!VALID_LANGS.has(lang)) lang = 'nl';
    let diff = (qs.get('difficulty') || 'medium').toLowerCase();
    if (!VALID_DIFF.has(diff)) diff = 'medium';
    const ptt = ['1', 'true', 'yes', 'on'].includes((qs.get('ptt') || '0').toLowerCase());
    const openedAt = Date.now();

    if (!REALTIME_ENDPOINT && !(process.env.AZURE_REALTIME_URL || '').trim()) {
      try { browser.send(JSON.stringify({ type: 'sollicitatie.error', data: { message: 'Sanne is niet geconfigureerd op de server.' } })); } catch (e) {}
      browser.close();
      return;
    }

    const pending = {}; // call_id -> { name, args }
    let closed = false;

    const upstream = new WebSocket(upstreamUrl(), { headers: { 'api-key': REALTIME_API_KEY } });

    const toBrowser = (s) => { if (!closed && browser.readyState === WebSocket.OPEN) { try { browser.send(s); } catch (e) {} } };
    const toUpstream = (s) => { if (!closed && upstream.readyState === WebSocket.OPEN) { try { upstream.send(s); } catch (e) {} } };

    function echoToolOutput(callId, name, resultObj) {
      toUpstream(JSON.stringify({
        type: 'conversation.item.create',
        item: { type: 'function_call_output', call_id: callId, output: JSON.stringify(resultObj) },
      }));
      if (name === 'end_interview') {
        const summary = (resultObj.summary || '').trim();
        const response = REALTIME_API === 'v1'
          ? { instructions: (END_INSTRUCTIONS[lang] || END_INSTRUCTIONS.nl) + summary }
          : { modalities: ['audio', 'text'], instructions: (END_INSTRUCTIONS[lang] || END_INSTRUCTIONS.nl) + summary };
        toUpstream(JSON.stringify({ type: 'response.create', response }));
      } else {
        toUpstream(JSON.stringify({ type: 'response.create' }));
      }
    }

    function handleCompletedTool(callId) {
      const rec = pending[callId];
      if (!rec) return;
      delete pending[callId];
      const name = rec.name || '';
      let parsed = {};
      try { parsed = rec.args ? JSON.parse(rec.args) : {}; } catch (e) { parsed = {}; }

      if (name === 'end_interview') {
        const result = deriveResult(parsed, diff, openedAt);
        if (!result.summary) result.summary = fallbackSummary(lang, result.grade, result.accepted);
        toBrowser(JSON.stringify({ type: 'sollicitatie.tool_call', data: { name, arguments: result, call_id: callId } }));
        echoToolOutput(callId, name, { ok: true, summary: result.summary });
        return;
      }

      toBrowser(JSON.stringify({ type: 'sollicitatie.tool_call', data: { name, arguments: parsed, call_id: callId } }));
      if (name === 'advance_to_step') echoToolOutput(callId, name, { ok: true, step: parsed.step });
      else echoToolOutput(callId, name, { ok: true });
    }

    upstream.on('open', () => {
      toUpstream(buildSession(lang, ptt, diff));
      toUpstream(greetNow(lang));
    });

    upstream.on('message', (data, isBinary) => {
      if (isBinary) return;
      const text = data.toString('utf8');
      toBrowser(text);
      let evt;
      try { evt = JSON.parse(text); } catch (e) { return; }
      const etype = evt.type || '';

      if (etype === 'response.output_item.added') {
        const item = evt.item || {};
        if (item.type === 'function_call') {
          const callId = item.call_id || item.id || '';
          if (callId) pending[callId] = { name: item.name || '', args: item.arguments || '' };
        }
      } else if (etype === 'response.function_call_arguments.delta') {
        const callId = evt.call_id || '';
        if (callId) {
          if (!pending[callId]) pending[callId] = { name: '', args: '' };
          pending[callId].args = (pending[callId].args || '') + (evt.delta || '');
        }
      } else if (etype === 'response.function_call_arguments.done') {
        const callId = evt.call_id || '';
        if (callId && pending[callId]) {
          if (typeof evt.arguments === 'string' && evt.arguments) pending[callId].args = evt.arguments;
          if (!pending[callId].name && evt.name) pending[callId].name = evt.name;
          handleCompletedTool(callId);
        }
      } else if (etype === 'response.output_item.done') {
        const item = evt.item || {};
        if (item.type === 'function_call') {
          const callId = item.call_id || item.id || '';
          if (callId && pending[callId]) {
            if (typeof item.arguments === 'string' && item.arguments) pending[callId].args = item.arguments;
            if (!pending[callId].name) pending[callId].name = item.name || '';
            handleCompletedTool(callId);
          }
        }
      }
    });

    upstream.on('close', () => {
      if (!closed) {
        try { toBrowser(JSON.stringify({ type: 'sollicitatie.error', data: { message: DISCONNECT_ERRORS[lang] || DISCONNECT_ERRORS.nl } })); } catch (e) {}
      }
      closed = true;
      try { browser.close(); } catch (e) {}
    });

    upstream.on('error', (err) => {
      console.error('[sanne] upstream error:', err.message);
      if (!closed) {
        try { browser.send(JSON.stringify({ type: 'sollicitatie.error', data: { message: 'Kan niet verbinden met Sanne.' } })); } catch (e) {}
      }
      closed = true;
      try { browser.close(); } catch (e) {}
    });

    browser.on('message', (data, isBinary) => {
      if (isBinary) return;
      toUpstream(data.toString('utf8'));
    });
    browser.on('close', () => { closed = true; try { upstream.close(); } catch (e) {} });
    browser.on('error', () => { closed = true; try { upstream.close(); } catch (e) {} });
  });
}

module.exports = { attachSollicitatie };

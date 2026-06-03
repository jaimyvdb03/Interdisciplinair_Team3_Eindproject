// Server-side Trivia: realtime quiz proxy hosted by "Pim", a multilingual
// quizmaster. Mirrors sanne.js: the browser opens a WebSocket to /api/trivia,
// this proxies bidirectionally to Azure OpenAI Realtime, injecting the Pim
// prompt and handling the start_round / score_round / end_quiz tool calls.
// Single difficulty ("medium"). Five rounds. The Azure key stays server-side.

const crypto = require('crypto');
const { WebSocketServer, WebSocket } = require('ws');

const PROMPTS = require('./trivia_prompts.json'); // { nl, en, es }

const REALTIME_ENDPOINT = (process.env.AZURE_REALTIME_ENDPOINT || '').replace(/\/+$/, '');
const REALTIME_API_KEY  = process.env.AZURE_REALTIME_API_KEY || '';
const REALTIME_API_VER  = process.env.AZURE_REALTIME_API_VERSION || '2024-10-01-preview';
const REALTIME_DEPLOY   = process.env.AZURE_REALTIME_DEPLOYMENT || 'gpt-realtime-1.5';
const REALTIME_VOICE    = process.env.AZURE_TRIVIA_VOICE || process.env.AZURE_REALTIME_VOICE || 'verse';
const REALTIME_API      = (process.env.REALTIME_API || '').toLowerCase();

const VALID_LANGS = new Set(['nl', 'en', 'es']);
const N_ROUNDS = 5;
const MAX_PER_Q = 10;

function pickPrompt(lang) { return PROMPTS[lang] || PROMPTS.nl; }

const GREET = {
  nl: 'Start de quiz nu. Geef een korte, vrolijke begroeting als Pim, vraag de voornaam van de speler en wacht dan op het antwoord. Kort, B1-Nederlands, max 2 zinnen, geen JSON.',
  en: 'Start the quiz now. Give a short cheerful welcome as Pim, ask the player\'s first name, then wait for their answer. Short, plain English, max 2 sentences, no JSON.',
  es: 'Comienza el concurso ahora. Da una bienvenida corta y alegre como Pim, pregunta el nombre del jugador y espera su respuesta. Corto, español sencillo, máximo 2 oraciones, sin JSON.',
};

const END_INSTRUCTIONS = {
  nl: 'De quiz is klaar. Lees de volgende samenvatting vrolijk en warm hardop voor, in je rol als Pim. Korte B1-zinnen, geen JSON, geen accolades. Samenvatting: ',
  en: 'The quiz is finished. Read the following summary cheerfully and warmly aloud, in your role as Pim. Short plain sentences, no JSON, no curly braces. Summary: ',
  es: 'El concurso ha terminado. Lee el siguiente resumen con alegría y calidez en voz alta, en tu papel de Pim. Frases cortas y sencillas, sin JSON, sin llaves. Resumen: ',
};

const DISCONNECT_ERRORS = {
  nl: 'Verbinding met Pim is verbroken. Probeer het opnieuw.',
  en: 'Connection with Pim was lost. Please try again.',
  es: 'Se ha perdido la conexión con Pim. Por favor, inténtalo de nuevo.',
};

const TOOLS = [
  {
    type: 'function',
    name: 'start_round',
    description: 'Call this BEFORE asking the question of each round, including round 1. Tells the app which round and topic is starting.',
    parameters: {
      type: 'object',
      properties: {
        round: { type: 'integer', minimum: 1, maximum: 5, description: 'The round number (1-5).' },
        topic: { type: 'string', description: 'One lowercase topic word: geography, history, science, language, culture, food, sports, music.' },
      },
      required: ['round', 'topic'],
    },
  },
  {
    type: 'function',
    name: 'score_round',
    description: 'Call this AFTER the player answers a question, once you have told them whether it was correct.',
    parameters: {
      type: 'object',
      properties: {
        round:   { type: 'integer', minimum: 1, maximum: 5 },
        points:  { type: 'number', minimum: 0, maximum: 10, description: 'Points awarded (0-10, partial credit allowed).' },
        max:     { type: 'number', minimum: 0, maximum: 10, description: 'Max points for this round (10).' },
        topic:   { type: 'string' },
        correct: { type: 'boolean' },
      },
      required: ['round', 'points', 'max', 'topic', 'correct'],
    },
  },
  {
    type: 'function',
    name: 'end_quiz',
    description: 'Call this exactly once after round 5 is scored, to finish the quiz.',
    parameters: {
      type: 'object',
      properties: {
        rounds: {
          type: 'array', minItems: 1, maxItems: 5,
          items: {
            type: 'object',
            properties: {
              topic:   { type: 'string' },
              correct: { type: 'boolean' },
              points:  { type: 'number', minimum: 0, maximum: 10 },
              max:     { type: 'number', minimum: 0, maximum: 10 },
            },
            required: ['topic', 'correct', 'points', 'max'],
          },
        },
        total_points:   { type: 'number', minimum: 0, maximum: 50 },
        summary:        { type: 'string', description: 'A short spoken summary (2-4 short sentences) Pim reads aloud.' },
        candidate_name: { type: 'string', description: 'The player\'s first name; empty if unsure.' },
      },
      required: ['rounds', 'total_points', 'summary', 'candidate_name'],
    },
  },
];

function upstreamUrl() {
  const direct = (process.env.AZURE_REALTIME_URL || '').trim();
  if (direct) return direct.replace(/^https?:\/\//, 'wss://');
  const host = REALTIME_ENDPOINT.replace(/^https?:\/\//, '');
  return `wss://${host}/openai/realtime?api-version=${encodeURIComponent(REALTIME_API_VER)}&deployment=${encodeURIComponent(REALTIME_DEPLOY)}`;
}

function sessionUpdate(lang, ptt) {
  return JSON.stringify({
    type: 'session.update',
    session: {
      modalities: ['audio', 'text'],
      voice: REALTIME_VOICE,
      instructions: pickPrompt(lang),
      input_audio_format: 'pcm16',
      output_audio_format: 'pcm16',
      input_audio_transcription: { model: 'whisper-1', language: lang },
      temperature: 0.7,
      max_response_output_tokens: 1000,
      tools: TOOLS,
      tool_choice: 'auto',
      turn_detection: ptt ? null : {
        type: 'server_vad', threshold: 0.5, prefix_padding_ms: 300, silence_duration_ms: 700,
        create_response: true, interrupt_response: false,
      },
    },
  });
}

function sessionUpdateV1(lang, ptt) {
  return JSON.stringify({
    type: 'session.update',
    session: {
      type: 'realtime',
      instructions: pickPrompt(lang),
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

function buildSession(lang, ptt) {
  return REALTIME_API === 'v1' ? sessionUpdateV1(lang, ptt) : sessionUpdate(lang, ptt);
}

function greetNow(lang) {
  const response = REALTIME_API === 'v1'
    ? { instructions: GREET[lang] || GREET.nl }
    : { modalities: ['audio', 'text'], instructions: GREET[lang] || GREET.nl };
  return JSON.stringify({ type: 'response.create', response });
}

function round1(n) { return Math.round(n * 10) / 10; }
function clampPts(v) { const n = Number(v); return Number.isFinite(n) ? Math.max(0, Math.min(MAX_PER_Q, n)) : 0; }

// Per-round speed bonus: only awarded if the answer was correct. Faster
// correct answers earn more, slow ones earn nothing. Caps per round at +5,
// so each round can yield up to 15 effective points (10 base + 5 bonus).
function computeTimeBonus(durationSec, correct) {
  if (!correct) return 0;
  if (durationSec < 6) return 5;
  if (durationSec < 12) return 3;
  if (durationSec < 20) return 1;
  return 0;
}

function deriveQuizResult(parsed, openedAt, roundResults) {
  // Prefer server-tracked rounds when available (authoritative timing).
  const trackedNums = Object.keys(roundResults || {}).map(Number).sort((a, b) => a - b);
  let rounds;
  if (trackedNums.length > 0) {
    rounds = trackedNums.map((n) => {
      const r = roundResults[n];
      const points = round1(clampPts(r.points));
      const tb = round1(r.time_bonus || 0);
      return {
        topic: (r.topic || '').slice(0, 24).toLowerCase(),
        correct: !!r.correct,
        points,
        max: round1(clampPts(r.max != null ? r.max : MAX_PER_Q)),
        duration_seconds: r.duration_seconds | 0,
        time_bonus: tb,
        total: round1(points + tb),
      };
    });
  } else {
    // Fallback: trust whatever the model put in end_quiz.
    const rawRounds = Array.isArray(parsed.rounds) ? parsed.rounds.slice(0, N_ROUNDS) : [];
    rounds = rawRounds.map((r) => {
      const points = round1(clampPts(r && r.points));
      return {
        topic: (typeof (r && r.topic) === 'string' ? r.topic : '').slice(0, 24).toLowerCase(),
        correct: !!(r && r.correct),
        points,
        max: round1(clampPts((r && r.max) != null ? r.max : MAX_PER_Q)),
        duration_seconds: 0,
        time_bonus: 0,
        total: points,
      };
    });
  }
  const totalBase = round1(rounds.reduce((a, r) => a + r.points, 0));
  const totalBonus = round1(rounds.reduce((a, r) => a + r.time_bonus, 0));
  const totalPoints = round1(totalBase + totalBonus);
  const maxSum = rounds.reduce((a, r) => a + r.max, 0) || (N_ROUNDS * MAX_PER_Q);
  const accuracy = Math.max(0, Math.min(100, Math.round((totalBase / maxSum) * 100)));
  const duration = Math.max(0, Math.floor((Date.now() - openedAt) / 1000));
  return {
    game: 'trivia',
    difficulty: 'medium',
    rounds,
    total_points: totalPoints,
    base_points: totalBase,
    time_bonus_total: totalBonus,
    accuracy_pct: accuracy,
    leaderboard_points: totalPoints,
    duration_seconds: duration,
    candidate_name: (typeof parsed.candidate_name === 'string' ? parsed.candidate_name : '').slice(0, 40).trim(),
    summary: (parsed.summary || '').trim(),
    id: crypto.randomBytes(8).toString('hex'),
    timestamp: new Date().toISOString(),
  };
}

function fallbackSummary(lang, total) {
  const t = `${total}`;
  if (lang === 'en') return `That is the quiz! You scored ${t} out of 50 points. Well played!`;
  if (lang === 'es') return `¡Eso es todo! Conseguiste ${t} de 50 puntos. ¡Bien jugado!`;
  return `Dat was de quiz! Je hebt ${t} van de 50 punten. Goed gedaan!`;
}

function attachTrivia(server) {
  const wss = new WebSocketServer({ noServer: true });

  server.on('upgrade', (req, socket, head) => {
    let pathname;
    try { pathname = new URL(req.url, 'http://localhost').pathname; } catch (e) { pathname = req.url; }
    if (pathname === '/api/trivia') {
      wss.handleUpgrade(req, socket, head, (ws) => wss.emit('connection', ws, req));
    }
    // /api/sollicitatie handled by sanne.js's own upgrade listener; other paths ignored here.
  });

  wss.on('connection', (browser, req) => {
    const qs = new URL(req.url, 'http://localhost').searchParams;
    let lang = (qs.get('lang') || 'nl').toLowerCase();
    if (!VALID_LANGS.has(lang)) lang = 'nl';
    const ptt = ['1', 'true', 'yes', 'on'].includes((qs.get('ptt') || '0').toLowerCase());
    const openedAt = Date.now();
    // Per-round timing: roundStarts[n] is set when start_round fires; durations
    // are computed when score_round arrives. roundResults aggregates them so
    // end_quiz can build an authoritative scoreboard.
    const roundStarts = {};
    const roundResults = {};

    if (!REALTIME_ENDPOINT && !(process.env.AZURE_REALTIME_URL || '').trim()) {
      try { browser.send(JSON.stringify({ type: 'trivia.error', data: { message: 'Pim is niet geconfigureerd op de server.' } })); } catch (e) {}
      browser.close();
      return;
    }

    const pending = {};
    let closed = false;
    const upstream = new WebSocket(upstreamUrl(), { headers: { 'api-key': REALTIME_API_KEY } });

    const toBrowser = (s) => { if (!closed && browser.readyState === WebSocket.OPEN) { try { browser.send(s); } catch (e) {} } };
    const toUpstream = (s) => { if (!closed && upstream.readyState === WebSocket.OPEN) { try { upstream.send(s); } catch (e) {} } };

    function echoToolOutput(callId, name, resultObj) {
      toUpstream(JSON.stringify({
        type: 'conversation.item.create',
        item: { type: 'function_call_output', call_id: callId, output: JSON.stringify(resultObj) },
      }));
      if (name === 'end_quiz') {
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

      if (name === 'start_round') {
        const round = parseInt(parsed.round, 10);
        if (round >= 1 && round <= N_ROUNDS) roundStarts[round] = Date.now();
        toBrowser(JSON.stringify({ type: 'trivia.tool_call', data: { name, arguments: parsed, call_id: callId } }));
        echoToolOutput(callId, name, { ok: true });
        return;
      }

      if (name === 'score_round') {
        const round = parseInt(parsed.round, 10);
        const correct = !!parsed.correct;
        const basePoints = clampPts(parsed.points);
        const startedAt = roundStarts[round] || openedAt;
        const duration = Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
        const timeBonus = computeTimeBonus(duration, correct);
        const augmented = Object.assign({}, parsed, {
          points: round1(basePoints),
          max: round1(clampPts(parsed.max != null ? parsed.max : MAX_PER_Q)),
          duration_seconds: duration,
          time_bonus: timeBonus,
          total: round1(basePoints + timeBonus),
        });
        if (round >= 1 && round <= N_ROUNDS) roundResults[round] = augmented;
        toBrowser(JSON.stringify({ type: 'trivia.tool_call', data: { name, arguments: augmented, call_id: callId } }));
        echoToolOutput(callId, name, { ok: true });
        return;
      }

      if (name === 'end_quiz') {
        const result = deriveQuizResult(parsed, openedAt, roundResults);
        if (!result.summary) result.summary = fallbackSummary(lang, result.total_points);
        toBrowser(JSON.stringify({ type: 'trivia.tool_call', data: { name, arguments: result, call_id: callId } }));
        echoToolOutput(callId, name, { ok: true, summary: result.summary });
        return;
      }

      toBrowser(JSON.stringify({ type: 'trivia.tool_call', data: { name, arguments: parsed, call_id: callId } }));
      echoToolOutput(callId, name, { ok: true });
    }

    upstream.on('open', () => {
      toUpstream(buildSession(lang, ptt));
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
        try { toBrowser(JSON.stringify({ type: 'trivia.error', data: { message: DISCONNECT_ERRORS[lang] || DISCONNECT_ERRORS.nl } })); } catch (e) {}
      }
      closed = true;
      try { browser.close(); } catch (e) {}
    });

    upstream.on('error', (err) => {
      console.error('[trivia] upstream error:', err.message);
      if (!closed) {
        try { browser.send(JSON.stringify({ type: 'trivia.error', data: { message: 'Kan niet verbinden met Pim.' } })); } catch (e) {}
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

module.exports = { attachTrivia };

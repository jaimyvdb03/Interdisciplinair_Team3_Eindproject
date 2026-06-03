// Express server: serves the React build, proxies TTS to Azure OpenAI gpt-audio,
// hosts the realtime WebSocket proxies (Sanne + Trivia/Pim), and a small JSON
// leaderboard. The Azure API keys never reach the browser.

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { attachSollicitatie } = require('./sanne');
const { attachTrivia } = require('./trivia');

const app = express();
app.use(express.json({ limit: '64kb' }));

const PORT = process.env.PORT || 8080;

const AZURE_ENDPOINT   = (process.env.AZURE_AUDIO_ENDPOINT || '').replace(/\/+$/, '');
const AZURE_API_KEY    = process.env.AZURE_AUDIO_API_KEY || '';
const AZURE_DEPLOYMENT = process.env.AZURE_AUDIO_DEPLOYMENT || 'gpt-audio-1.5';
const AZURE_API_VER    = process.env.AZURE_AUDIO_API_VERSION || '2025-04-01-preview';
const AUDIO_VOICE      = process.env.AZURE_AUDIO_VOICE || 'alloy';

app.get('/healthz', (_req, res) => res.status(200).send('OK'));

app.post('/api/tts', async (req, res) => {
  const text = (req.body && typeof req.body.text === 'string') ? req.body.text.trim() : '';
  if (!text) return res.status(400).json({ error: 'text is required' });
  if (text.length > 2000) return res.status(400).json({ error: 'text too long' });

  if (!AZURE_ENDPOINT || !AZURE_API_KEY) {
    return res.status(500).json({ error: 'TTS not configured (missing endpoint or key)' });
  }

  const url =
    `${AZURE_ENDPOINT}/openai/deployments/${encodeURIComponent(AZURE_DEPLOYMENT)}` +
    `/chat/completions?api-version=${encodeURIComponent(AZURE_API_VER)}`;

  const body = {
    modalities: ['text', 'audio'],
    audio: { voice: AUDIO_VOICE, format: 'wav' },
    messages: [
      {
        role: 'system',
        content:
          'Je bent een Nederlandse voorleesstem. Lees de tekst van de gebruiker letterlijk en ' +
          'rustig voor in het Nederlands. Voeg niets toe, laat niets weg, en reageer niet inhoudelijk.',
      },
      { role: 'user', content: text },
    ],
  };

  try {
    const upstream = await fetch(url, {
      method: 'POST',
      headers: { 'api-key': AZURE_API_KEY, 'content-type': 'application/json' },
      body: JSON.stringify(body),
    });
    if (!upstream.ok) {
      const errTxt = await upstream.text().catch(() => '');
      console.error('[tts] upstream', upstream.status, errTxt.slice(0, 500));
      return res.status(502).json({ error: 'upstream error', status: upstream.status });
    }
    const data = await upstream.json();
    const audioB64 = data?.choices?.[0]?.message?.audio?.data;
    if (!audioB64) {
      console.error('[tts] no audio in response', JSON.stringify(data).slice(0, 500));
      return res.status(502).json({ error: 'no audio in response' });
    }
    res.json({ audio: audioB64, format: 'wav' });
  } catch (e) {
    console.error('[tts] fetch failed:', e);
    res.status(502).json({ error: 'fetch failed' });
  }
});

// ── Leaderboard ───────────────────────────────────────────────────────────────
// One JSON file with boards keyed by "<game>:<difficulty>". On Azure the /home
// mount is persistent across restarts; locally we fall back to a .data dir.
const MAX_PER_BOARD = 500;
const VALID_GAMES = new Set(['sollicitatie', 'trivia']);

const DATA_DIR = process.env.LEADERBOARD_DIR
  || (fs.existsSync('/home') ? '/home/data' : path.join(__dirname, '.data'));
const LB_FILE = path.join(DATA_DIR, 'leaderboard.json');

function lbLoad() {
  try { return JSON.parse(fs.readFileSync(LB_FILE, 'utf8')) || {}; }
  catch (e) { return {}; }
}
function lbSave(db) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(LB_FILE, JSON.stringify(db));
    return true;
  } catch (e) { console.error('[leaderboard] save failed:', e.message); return false; }
}
function boardKey(game, difficulty) { return `${game}:${difficulty}`; }
function num(v, def = 0) { const n = Number(v); return Number.isFinite(n) ? n : def; }
function clean(v, max = 200) { return (typeof v === 'string' ? v : '').slice(0, max); }
function diffSlug(v, def = 'medium') {
  const s = clean(v, 16).toLowerCase().trim();
  return /^[a-z0-9_-]{1,16}$/.test(s) ? s : def;
}

app.get('/api/leaderboard', (req, res) => {
  const game = VALID_GAMES.has(String(req.query.game)) ? String(req.query.game) : 'sollicitatie';
  const difficulty = diffSlug(req.query.difficulty, game === 'trivia' ? 'medium' : 'medium');
  let limit = Math.floor(num(req.query.limit, 20));
  if (!(limit > 0)) limit = 20;
  if (limit > 100) limit = 100;
  const db = lbLoad();
  const entries = (db[boardKey(game, difficulty)] || [])
    .slice()
    .sort((a, b) => num(b.leaderboard_points) - num(a.leaderboard_points))
    .slice(0, limit);
  res.json({ game, difficulty, entries });
});

app.post('/api/leaderboard', (req, res) => {
  const b = req.body || {};
  const game = VALID_GAMES.has(String(b.game)) ? String(b.game) : null;
  if (!game) return res.status(400).json({ error: 'invalid game' });
  const difficulty = diffSlug(b.difficulty, game === 'trivia' ? 'medium' : 'medium');

  // Sanitize + clamp into a stored entry. id/timestamp are (re)stamped server-side.
  const entry = {
    id: /^[a-f0-9]{4,32}$/.test(String(b.id || '')) ? String(b.id) : Math.random().toString(16).slice(2, 18),
    game,
    difficulty,
    candidate_name: clean(b.candidate_name, 40).trim() || 'Anoniem',
    leaderboard_points: Math.round(num(b.leaderboard_points) * 10) / 10,
    duration_seconds: Math.max(0, Math.floor(num(b.duration_seconds))),
    summary: clean(b.summary, 600),
    timestamp: new Date().toISOString(),
  };
  if (game === 'sollicitatie') {
    entry.grade = Math.round(num(b.grade) * 10) / 10;
    entry.accepted = !!b.accepted;
    entry.difficulty_bonus = Math.round(num(b.difficulty_bonus) * 10) / 10;
    const s = b.scores || {};
    entry.scores = {
      clarity: clampScore(s.clarity), motivation: clampScore(s.motivation),
      customer_focus: clampScore(s.customer_focus), availability: clampScore(s.availability),
      examples: clampScore(s.examples),
    };
  } else {
    entry.total_points = Math.round(num(b.total_points) * 10) / 10;
    entry.accuracy_pct = Math.max(0, Math.min(100, Math.round(num(b.accuracy_pct))));
    entry.bonus_speed_pts = Math.round(num(b.bonus_speed_pts) * 10) / 10;
    entry.rounds = Array.isArray(b.rounds) ? b.rounds.slice(0, 7).map((r) => ({
      topic: clean(r && r.topic, 24), correct: !!(r && r.correct),
      points: clampScore(r && r.points), max: clampScore((r && r.max) || 10),
    })) : [];
  }

  const db = lbLoad();
  const key = boardKey(game, difficulty);
  const board = Array.isArray(db[key]) ? db[key] : [];
  board.push(entry);
  board.sort((a, b2) => num(b2.leaderboard_points) - num(a.leaderboard_points));
  if (board.length > MAX_PER_BOARD) board.length = MAX_PER_BOARD;
  db[key] = board;
  lbSave(db);

  const rank = board.findIndex((e) => e.id === entry.id) + 1;
  res.json({ ok: true, rank, total: board.length, entry });
});

function clampScore(v) { const n = num(v); return Math.round(Math.max(0, Math.min(10, n)) * 10) / 10; }

const buildDir = path.join(__dirname, 'build');
app.use(express.static(buildDir));
app.get('*', (_req, res) => res.sendFile(path.join(buildDir, 'index.html')));

const server = http.createServer(app);
attachSollicitatie(server); // WebSocket upgrades on /api/sollicitatie
attachTrivia(server);       // WebSocket upgrades on /api/trivia

server.listen(PORT, () => {
  console.log(`Listening on :${PORT} — build: ${buildDir} — data: ${DATA_DIR}`);
});

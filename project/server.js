// Express server: serves the React build, proxies TTS to Azure OpenAI gpt-audio,
// and hosts the realtime WebSocket proxy (Sanne). The Azure API keys never reach the browser.

const express = require('express');
const http = require('http');
const path = require('path');
const fs = require('fs');
const { attachSollicitatie } = require('./sanne');
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

const buildDir = path.join(__dirname, 'build');
app.use(express.static(buildDir));
app.get('*', (_req, res) => res.sendFile(path.join(buildDir, 'index.html')));

const server = http.createServer(app);
attachSollicitatie(server); // WebSocket upgrades on /api/sollicitatie

server.listen(PORT, () => {
  console.log(`Listening on :${PORT} — build: ${buildDir} — data: ${DATA_DIR}`);
});

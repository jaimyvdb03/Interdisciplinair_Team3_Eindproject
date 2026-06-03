import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { createCapture, createPlayback } from '../lib/realtime';

const N_ROUNDS = 5;
const TOPICS = new Set(['geography', 'history', 'science', 'language', 'culture', 'food', 'sports', 'music']);

const UI = {
  nl: {
    title: 'Trivia Quiz', introTitle: 'Speel mee met Pim',
    introText: 'Pim is jouw quizmaster. Hij stelt vijf vragen over de hele wereld: aardrijkskunde, geschiedenis, wetenschap en meer. Praat gewoon en zeg je antwoord hardop.',
    start: 'Start de quiz', stop: 'Stop quiz', retry: 'Opnieuw spelen',
    listening: 'Pim luistert…', talking: 'Pim is aan het woord…',
    micHint: 'Zet je microfoon aan als je browser erom vraagt.',
    you: 'Jij', pim: 'Pim', roundLabel: 'Vraag', roundOf: 'van',
    resultTitle: 'Jouw resultaat', totalLabel: 'Punten', accuracyLabel: 'Goed beantwoord',
    bonusLabel: 'Snelheidsbonus', pointsLabel: 'Leaderboard-punten',
    correct: 'Goed', wrong: 'Fout',
    place: 'Plaats op leaderboard', placing: 'Bezig…', viewBoard: 'Bekijk leaderboard',
    errMic: 'Pim hoort je niet. Controleer je microfoon.', errGeneric: 'Er ging iets mis. Probeer het opnieuw.',
    pttTitle: 'Druk-om-te-praten', pttHint: 'Standaard luistert Pim automatisch. Zet dit aan bij veel achtergrondgeluid.',
    pttOff: 'Uit (automatisch)', pttOn: 'Aan (knop)', talk: 'Druk om te praten', send: 'Verstuur antwoord', wait: 'Pim is aan het woord…',
    topics: { geography: 'Aardrijkskunde', history: 'Geschiedenis', science: 'Wetenschap', language: 'Taal', culture: 'Cultuur', food: 'Eten', sports: 'Sport', music: 'Muziek' },
  },
  en: {
    title: 'Trivia Quiz', introTitle: 'Play with Pim',
    introText: 'Pim is your quizmaster. He asks five questions about the world: geography, history, science and more. Just speak and say your answer out loud.',
    start: 'Start the quiz', stop: 'Stop quiz', retry: 'Play again',
    listening: 'Pim is listening…', talking: 'Pim is talking…',
    micHint: 'Allow microphone access when your browser asks.',
    you: 'You', pim: 'Pim', roundLabel: 'Question', roundOf: 'of',
    resultTitle: 'Your result', totalLabel: 'Points', accuracyLabel: 'Answered correctly',
    bonusLabel: 'Speed bonus', pointsLabel: 'Leaderboard points',
    correct: 'Correct', wrong: 'Wrong',
    place: 'Add to leaderboard', placing: 'Saving…', viewBoard: 'View leaderboard',
    errMic: 'Pim cannot hear you. Check your microphone.', errGeneric: 'Something went wrong. Please try again.',
    pttTitle: 'Push-to-talk', pttHint: 'By default Pim listens automatically. Turn this on in noisy places.',
    pttOff: 'Off (automatic)', pttOn: 'On (button)', talk: 'Press to talk', send: 'Send answer', wait: 'Pim is talking…',
    topics: { geography: 'Geography', history: 'History', science: 'Science', language: 'Language', culture: 'Culture', food: 'Food', sports: 'Sports', music: 'Music' },
  },
  es: {
    title: 'Concurso Trivia', introTitle: 'Juega con Pim',
    introText: 'Pim es tu presentador. Hace cinco preguntas sobre el mundo: geografía, historia, ciencia y más. Habla con naturalidad y di tu respuesta en voz alta.',
    start: 'Comenzar el concurso', stop: 'Parar concurso', retry: 'Jugar de nuevo',
    listening: 'Pim está escuchando…', talking: 'Pim está hablando…',
    micHint: 'Activa el micrófono cuando el navegador te lo pida.',
    you: 'Tú', pim: 'Pim', roundLabel: 'Pregunta', roundOf: 'de',
    resultTitle: 'Tu resultado', totalLabel: 'Puntos', accuracyLabel: 'Respuestas correctas',
    bonusLabel: 'Bonus de velocidad', pointsLabel: 'Puntos de leaderboard',
    correct: 'Correcto', wrong: 'Incorrecto',
    place: 'Añadir al leaderboard', placing: 'Guardando…', viewBoard: 'Ver leaderboard',
    errMic: 'Pim no te oye. Revisa tu micrófono.', errGeneric: 'Algo salió mal. Por favor, inténtalo de nuevo.',
    pttTitle: 'Pulsa para hablar', pttHint: 'Por defecto Pim escucha automáticamente. Actívalo en lugares ruidosos.',
    pttOff: 'Apagado (automático)', pttOn: 'Encendido (botón)', talk: 'Pulsa para hablar', send: 'Enviar respuesta', wait: 'Pim está hablando…',
    topics: { geography: 'Geografía', history: 'Historia', science: 'Ciencia', language: 'Idioma', culture: 'Cultura', food: 'Comida', sports: 'Deportes', music: 'Música' },
  },
};

const imgUrl = (name) => (process.env.PUBLIC_URL || '') + '/images/trivia/' + name;
function getPtt() { try { return localStorage.getItem('tt-ptt') === '1'; } catch (e) { return false; } }
function setPttPref(on) { try { localStorage.setItem('tt-ptt', on ? '1' : '0'); } catch (e) {} }

export default function Trivia() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ui = UI[lang] || UI.nl;
  const quizLang = ['nl', 'en', 'es'].includes(lang) ? lang : 'nl';

  const [view, setView] = useState('intro'); // intro | live | results | error
  const [round, setRound] = useState(1);
  const [topic, setTopic] = useState('geography');
  const [rounds, setRounds] = useState([]); // [{round, topic, points, max, correct}]
  const [turns, setTurns] = useState([]);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [pimSpeaking, setPimSpeaking] = useState(false);
  const [ptt, setPtt] = useState(getPtt());
  const [recording, setRecording] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const pttMode = useRef(false);
  const recordingRef = useRef(false);
  const recordedFrames = useRef(0);
  const ws = useRef(null);
  const capture = useRef(null);
  const playback = useRef(null);
  const mediaStream = useRef(null);
  const running = useRef(false);
  const endResult = useRef(null);
  const transcriptBox = useRef(null);

  useEffect(() => () => { stop(); // eslint-disable-next-line
  }, []);
  useEffect(() => { const b = transcriptBox.current; if (b) b.scrollTop = b.scrollHeight; }, [turns]);

  function appendDelta(role, delta) {
    if (!delta) return;
    setTurns((prev) => {
      const arr = prev.slice(); const last = arr[arr.length - 1];
      if (last && last.role === role && !last.done) arr[arr.length - 1] = { ...last, text: last.text + delta };
      else arr.push({ role, text: delta, done: false });
      return arr;
    });
  }
  function finalizeRole(role) {
    setTurns((prev) => { const arr = prev.slice(); const last = arr[arr.length - 1]; if (last && last.role === role && !last.done) arr[arr.length - 1] = { ...last, done: true }; return arr; });
  }
  function setUserFinal(text) {
    if (!text) return;
    setTurns((prev) => { const arr = prev.slice(); const last = arr[arr.length - 1]; if (last && last.role === 'user' && !last.done) arr[arr.length - 1] = { role: 'user', text, done: true }; else arr.push({ role: 'user', text, done: true }); return arr; });
  }
  function showError(msg) { setErrorMsg(msg || ui.errGeneric); setView('error'); }

  function handleFrame(raw) {
    let evt; try { evt = JSON.parse(raw); } catch (e) { return; }
    const etype = evt.type || '';
    if (etype === 'response.created') { setPimSpeaking(true); return; }
    if ((etype === 'response.audio.delta' || etype === 'response.output_audio.delta') && evt.delta) { if (playback.current) playback.current.playB64(evt.delta); return; }
    if (etype === 'response.audio_transcript.delta' || etype === 'response.output_audio_transcript.delta') { appendDelta('pim', evt.delta || ''); return; }
    if (etype === 'response.audio_transcript.done' || etype === 'response.output_audio_transcript.done') { finalizeRole('pim'); return; }
    if (etype === 'response.done') { finalizeRole('pim'); setPimSpeaking(false); return; }
    if (etype === 'conversation.item.input_audio_transcription.delta') { appendDelta('user', evt.delta || ''); return; }
    if (etype === 'conversation.item.input_audio_transcription.completed') { setUserFinal(((evt.transcript || '') + '').trim()); return; }
    if (etype === 'trivia.tool_call' && evt.data) {
      const tc = evt.data; const name = tc.name || ''; const args = tc.arguments || {};
      if (name === 'start_round') {
        const n = parseInt(args.round, 10);
        if (!isNaN(n) && n >= 1 && n <= N_ROUNDS) setRound(n);
        if (args.topic && TOPICS.has(args.topic)) setTopic(args.topic);
      } else if (name === 'score_round') {
        const r = { round: parseInt(args.round, 10) || 0, topic: args.topic || '', points: Number(args.points) || 0, max: Number(args.max) || 10, correct: !!args.correct };
        setRounds((prev) => { const arr = prev.filter((x) => x.round !== r.round); arr.push(r); arr.sort((a, b) => a.round - b.round); return arr; });
      } else if (name === 'end_quiz') {
        endResult.current = args; running.current = false; setResult(args); setPosted(false); setView('results');
      }
      return;
    }
    if (etype === 'trivia.error' && evt.data) { showError(evt.data.message); return; }
  }

  function startRecording() {
    if (recordingRef.current || pimSpeaking) return;
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    recordingRef.current = true; recordedFrames.current = 0; setRecording(true);
  }
  function stopRecording() {
    if (!recordingRef.current) return;
    recordingRef.current = false; setRecording(false);
    if (ws.current && ws.current.readyState === WebSocket.OPEN && recordedFrames.current > 0) {
      try { ws.current.send(JSON.stringify({ type: 'input_audio_buffer.commit' })); ws.current.send(JSON.stringify({ type: 'response.create' })); } catch (e) {}
    }
    recordedFrames.current = 0;
  }
  function toggleTalk() { if (recordingRef.current) stopRecording(); else startRecording(); }

  async function start() {
    if (running.current) return;
    running.current = true; endResult.current = null;
    pttMode.current = getPtt();
    recordingRef.current = false; recordedFrames.current = 0; setRecording(false);
    setResult(null); setTurns([]); setRounds([]); setRound(1); setTopic('geography'); setPimSpeaking(false); setPosted(false); setView('live');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { showError(ui.errMic); running.current = false; return; }
    try { mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { showError(ui.errMic); running.current = false; return; }

    const sendFrame = (b64) => { if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return; ws.current.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64 })); recordedFrames.current++; };
    const shouldSend = () => !pttMode.current || recordingRef.current;
    capture.current = await createCapture(mediaStream.current, sendFrame, shouldSend);
    if (!capture.current) { showError(ui.errMic); running.current = false; await cleanupAudio(); return; }

    playback.current = createPlayback();
    playback.current.start();

    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const pttQs = pttMode.current ? '1' : '0';
    try { ws.current = new WebSocket(`${scheme}://${window.location.host}/api/trivia?lang=${quizLang}&ptt=${pttQs}`); }
    catch (e) { showError(ui.errGeneric); await cleanupAudio(); running.current = false; return; }
    ws.current.binaryType = 'arraybuffer';
    ws.current.onmessage = (evt) => handleFrame(evt.data);
    ws.current.onerror = () => { if (running.current) showError(ui.errGeneric); };
    ws.current.onclose = () => { if (running.current && !endResult.current) showError(ui.errGeneric); running.current = false; setPimSpeaking(false); cleanupAudio(); };
  }

  async function cleanupAudio() {
    try { capture.current && (await capture.current.teardown()); } catch (e) {}
    capture.current = null;
    try { playback.current && (await playback.current.stop()); } catch (e) {}
    playback.current = null;
    if (mediaStream.current) { try { mediaStream.current.getTracks().forEach((t) => t.stop()); } catch (e) {} mediaStream.current = null; }
  }

  async function stop() {
    const was = running.current; running.current = false; setPimSpeaking(false);
    recordingRef.current = false; setRecording(false); recordedFrames.current = 0;
    try { ws.current && ws.current.close(); } catch (e) {}
    ws.current = null;
    await cleanupAudio();
    if (was && !endResult.current) setView('intro');
  }

  async function placeOnBoard() {
    if (!result || posting) return;
    setPosting(true);
    try { await fetch('/api/leaderboard', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ game: 'trivia', ...result }) }); setPosted(true); } catch (e) {}
    setPosting(false);
    navigate('/leaderboard', { state: { game: 'trivia', difficulty: 'medium', highlightId: result.id } });
  }

  const topicImg = imgUrl((topic || 'geography') + '.png');

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button onClick={async () => { await stop(); navigate('/'); }} className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px">‹</button>
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">{ui.title}</h1>
        </div>

        <div className="px-4 sm:px-0">
          {/* Intro */}
          {view === 'intro' && (
            <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <div className="rounded-2xl overflow-hidden mb-4 bg-blue-100">
                <img src={imgUrl('trivia_intro.png')} alt="Pim" className="w-full max-h-[28vh] object-cover" loading="lazy"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} />
              </div>
              <h2 className="text-[18px] font-bold text-gray-900 mb-2">{ui.introTitle}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{ui.introText}</p>
              <p className="text-xs text-gray-400 mb-5">{ui.micHint}</p>

              <div className="bg-gray-50 rounded-2xl p-4 mb-5 text-left">
                <p className="text-sm font-bold text-gray-900 mb-1">{ui.pttTitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{ui.pttHint}</p>
                <div className="flex gap-2">
                  <button onClick={() => { setPtt(false); setPttPref(false); }} className={`flex-1 rounded-xl py-2.5 text-sm font-bold border-2 transition-colors ${!ptt ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>{ui.pttOff}</button>
                  <button onClick={() => { setPtt(true); setPttPref(true); }} className={`flex-1 rounded-xl py-2.5 text-sm font-bold border-2 transition-colors ${ptt ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>{ui.pttOn}</button>
                </div>
              </div>

              <button onClick={start} className="w-full max-w-sm mx-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors">{ui.start}</button>
            </div>
          )}

          {/* Live */}
          {view === 'live' && (
            <div>
              {/* round badges (number, colored by state) */}
              <div className="flex gap-1.5 mb-3">
                {Array.from({ length: N_ROUNDS }, (_, i) => i + 1).map((r) => {
                  const rr = rounds.find((x) => x.round === r);
                  const active = r === round;
                  return (
                    <div key={r} className={`flex-1 rounded-xl py-2 text-center text-sm font-bold shadow-sm ${rr ? (rr.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600') : (active ? 'bg-blue-600 text-white' : 'bg-white text-gray-400')}`}>
                      {r}
                    </div>
                  );
                })}
              </div>

              <div className="relative rounded-2xl overflow-hidden shadow-sm mb-3 bg-blue-100 min-h-[120px] flex items-center justify-center">
                <img src={topicImg} alt={ui.topics[topic] || topic} className="w-full max-h-[30vh] object-cover block"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                <div className="absolute left-3 top-3 bg-black/55 text-white rounded-xl px-3 py-1.5">
                  <p className="text-[11px] font-medium opacity-90">{ui.roundLabel} {round} {ui.roundOf} {N_ROUNDS}</p>
                  <p className="text-[13px] font-bold leading-tight">{ui.topics[topic] || topic}</p>
                </div>
                <div className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[12px] font-bold ${pimSpeaking ? 'bg-blue-600 text-white' : 'bg-white/85 text-blue-700'}`}>{pimSpeaking ? ui.talking : ui.listening}</div>
              </div>

              <div ref={transcriptBox} className="bg-white rounded-2xl p-4 shadow-sm mb-3 max-h-[30vh] overflow-y-auto">
                {turns.length === 0 && <p className="text-sm text-gray-400 text-center py-6">…</p>}
                {turns.map((turn, i) => turn.text ? (
                  <div key={i} className={`mb-2 ${turn.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`text-[11px] font-bold ${turn.role === 'user' ? 'text-blue-600' : 'text-gray-500'}`}>{turn.role === 'user' ? ui.you : ui.pim}</span>
                    <p className={`text-sm font-medium inline-block px-3 py-2 rounded-2xl mt-0.5 ${turn.role === 'user' ? 'bg-blue-50 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>{turn.text}</p>
                  </div>
                ) : null)}
              </div>

              {ptt && (
                <button onClick={toggleTalk} disabled={pimSpeaking && !recording}
                  className={`w-full max-w-sm mx-auto block border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors mb-2.5 ${recording ? 'bg-red-600 text-white animate-pulse' : (pimSpeaking ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white')}`}>
                  {recording ? ui.send : (pimSpeaking ? ui.wait : ui.talk)}
                </button>
              )}
              <button onClick={stop} className="w-full max-w-sm mx-auto block bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors">{ui.stop}</button>
            </div>
          )}

          {/* Results */}
          {view === 'results' && result && (
            <div>
              <div className="rounded-2xl p-5 shadow-sm text-center mb-3 bg-blue-600">
                <p className="text-sm font-bold text-white/80 mb-1">{ui.resultTitle}</p>
                <p className="text-4xl font-extrabold text-white">{Number(result.total_points) || 0}<span className="text-xl font-bold text-white/70"> / 50</span></p>
                <p className="text-sm font-bold text-white/90 mt-1">{ui.accuracyLabel}: {Number(result.accuracy_pct) || 0}%</p>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                {(result.rounds || []).map((r, i) => (
                  <div key={i} className="flex items-center gap-3 mb-2 last:mb-0">
                    <span className="w-6 text-center text-xs font-bold text-gray-400 shrink-0">{i + 1}</span>
                    <span className="flex-1 text-sm font-medium text-gray-800">{ui.topics[r.topic] || r.topic}</span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${r.correct ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{r.correct ? ui.correct : ui.wrong}</span>
                    <span className="text-sm font-bold text-gray-900 w-12 text-right">{Number(r.points) || 0}/{Number(r.max) || 10}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-sm">
                  <span className="text-gray-600">{ui.bonusLabel}</span>
                  <span className="font-bold text-blue-600">+{Number(result.bonus_speed_pts) || 0}</span>
                </div>
                <div className="flex justify-between items-center mt-1 text-sm">
                  <span className="font-bold text-gray-900">{ui.pointsLabel}</span>
                  <span className="font-extrabold text-blue-700 text-lg">{(Number(result.leaderboard_points) || 0).toFixed(1).replace('.', ',')}</span>
                </div>
              </div>

              <button onClick={placeOnBoard} disabled={posting} className="w-full max-w-sm mx-auto block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors mb-2.5 disabled:opacity-60">{posting ? ui.placing : (posted ? ui.viewBoard : ui.place)}</button>
              <button onClick={async () => { await stop(); endResult.current = null; setResult(null); setView('intro'); }} className="w-full max-w-sm mx-auto block bg-gray-200 hover:bg-gray-300 text-gray-800 border-none rounded-2xl py-3.5 text-base font-bold cursor-pointer transition-colors">{ui.retry}</button>
            </div>
          )}

          {/* Error */}
          {view === 'error' && (
            <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
              <p className="text-sm text-gray-700 mb-4">{errorMsg || ui.errGeneric}</p>
              <button onClick={() => setView('intro')} className="w-full max-w-sm mx-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors">{ui.retry}</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

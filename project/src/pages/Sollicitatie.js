import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { createCapture, createPlayback } from '../lib/realtime';

// ── UI strings (interview supports nl/en/es; tr/ar fall back to nl) ──────────
const UI = {
  nl: {
    title: 'Sollicitatiegesprek',
    introTitle: 'Oefen met Sanne',
    introText: 'Sanne is bedrijfsleider bij Albert Heijn. Ze stelt je vragen, net als in een echt gesprek. Praat gewoon en neem je tijd. Aan het eind krijg je een cijfer en tips.',
    start: 'Start het gesprek',
    stop: 'Stop gesprek',
    retry: 'Opnieuw oefenen',
    listening: 'Sanne luistert…',
    talking: 'Sanne is aan het woord…',
    micHint: 'Zet je microfoon aan als je browser erom vraagt.',
    you: 'Jij', sanne: 'Sanne',
    stepLabel: 'Stap', stepOf: 'van',
    accepted: 'Aangenomen!', rejected: 'Helaas, nog niet', grade: 'Cijfer:',
    good: 'Wat ging goed', better: 'Wat kan beter',
    errMic: 'Sanne hoort je niet. Controleer je microfoon.',
    errGeneric: 'Er ging iets mis. Probeer het opnieuw.',
    steps: ['Welkom', 'Motivatie', 'Beschikbaarheid', 'Klant & samenwerken', 'Afronding'],
    pttTitle: 'Druk-om-te-praten',
    pttHint: 'Standaard luistert Sanne automatisch. Zet dit aan bij veel achtergrondgeluid — dan druk je zelf op een knop als je klaar bent met praten.',
    pttOff: 'Uit (automatisch)', pttOn: 'Aan (knop)',
    talk: 'Druk om te praten', send: 'Verstuur antwoord', wait: 'Sanne is aan het woord…',
    diffTitle: 'Moeilijkheidsgraad', diffEasy: 'Makkelijk', diffMedium: 'Normaal', diffHard: 'Moeilijk',
    diffHint: 'Makkelijk: rustige dorpswinkel, veel hints. Moeilijk: drukke AH XL, strenger.',
    subScores: { clarity: 'Duidelijkheid', motivation: 'Motivatie', customer_focus: 'Klantgerichtheid', availability: 'Beschikbaarheid', examples: 'Voorbeelden' },
    scoresTitle: 'Jouw scores', bonusLabel: 'Moeilijkheidsbonus', totalLabel: 'Leaderboard-punten',
    place: 'Plaats op leaderboard', placing: 'Bezig…', viewBoard: 'Bekijk leaderboard',
  },
  en: {
    title: 'Job interview',
    introTitle: 'Practice with Sanne',
    introText: 'Sanne is the store manager at Albert Heijn. She asks you questions, just like a real interview. Speak naturally and take your time. At the end you get a score and tips.',
    start: 'Start the interview',
    stop: 'Stop interview',
    retry: 'Practice again',
    listening: 'Sanne is listening…',
    talking: 'Sanne is talking…',
    micHint: 'Allow microphone access when your browser asks.',
    you: 'You', sanne: 'Sanne',
    stepLabel: 'Step', stepOf: 'of',
    accepted: 'You got the job!', rejected: 'Not this time', grade: 'Score:',
    good: 'What went well', better: 'What can improve',
    errMic: 'Sanne cannot hear you. Check your microphone.',
    errGeneric: 'Something went wrong. Please try again.',
    steps: ['Welcome', 'Motivation', 'Availability', 'Customers & teamwork', 'Closing'],
    pttTitle: 'Push-to-talk',
    pttHint: 'By default Sanne listens automatically. Turn this on in noisy places — you press a button when you are done speaking.',
    pttOff: 'Off (automatic)', pttOn: 'On (button)',
    talk: 'Press to talk', send: 'Send answer', wait: 'Sanne is talking…',
    diffTitle: 'Difficulty', diffEasy: 'Easy', diffMedium: 'Normal', diffHard: 'Hard',
    diffHint: 'Easy: calm village store, lots of hints. Hard: busy AH XL, stricter.',
    subScores: { clarity: 'Clarity', motivation: 'Motivation', customer_focus: 'Customer focus', availability: 'Availability', examples: 'Examples' },
    scoresTitle: 'Your scores', bonusLabel: 'Difficulty bonus', totalLabel: 'Leaderboard points',
    place: 'Add to leaderboard', placing: 'Saving…', viewBoard: 'View leaderboard',
  },
  es: {
    title: 'Entrevista de trabajo',
    introTitle: 'Practica con Sanne',
    introText: 'Sanne es la gerente de Albert Heijn. Te hace preguntas, como en una entrevista real. Habla con naturalidad y tómate tu tiempo. Al final recibirás una puntuación y consejos.',
    start: 'Comenzar la entrevista',
    stop: 'Parar entrevista',
    retry: 'Practicar de nuevo',
    listening: 'Sanne está escuchando…',
    talking: 'Sanne está hablando…',
    micHint: 'Activa el micrófono cuando el navegador te lo pida.',
    you: 'Tú', sanne: 'Sanne',
    stepLabel: 'Paso', stepOf: 'de',
    accepted: '¡Contratado/a!', rejected: 'No esta vez', grade: 'Puntuación:',
    good: 'Lo que salió bien', better: 'Lo que puede mejorar',
    errMic: 'Sanne no te oye. Revisa tu micrófono.',
    errGeneric: 'Algo salió mal. Por favor, inténtalo de nuevo.',
    steps: ['Bienvenida', 'Motivación', 'Disponibilidad', 'Clientes y equipo', 'Cierre'],
    pttTitle: 'Pulsa para hablar',
    pttHint: 'Por defecto Sanne escucha automáticamente. Actívalo en lugares ruidosos — pulsas un botón cuando terminas de hablar.',
    pttOff: 'Apagado (automático)', pttOn: 'Encendido (botón)',
    talk: 'Pulsa para hablar', send: 'Enviar respuesta', wait: 'Sanne está hablando…',
    diffTitle: 'Dificultad', diffEasy: 'Fácil', diffMedium: 'Normal', diffHard: 'Difícil',
    diffHint: 'Fácil: tienda tranquila de pueblo, muchas pistas. Difícil: AH XL con mucho ajetreo, más estricta.',
    subScores: { clarity: 'Claridad', motivation: 'Motivación', customer_focus: 'Atención al cliente', availability: 'Disponibilidad', examples: 'Ejemplos' },
    scoresTitle: 'Tus puntuaciones', bonusLabel: 'Bonus de dificultad', totalLabel: 'Puntos de leaderboard',
    place: 'Añadir al leaderboard', placing: 'Guardando…', viewBoard: 'Ver leaderboard',
  },
};

const N_STEPS = 5;
const SUB_KEYS = ['clarity', 'motivation', 'customer_focus', 'availability', 'examples'];

// Step images mapped to the new 5-step structure (served from public/images/sollicitatie/).
const STEP_IMG = {
  1: 'step1_welcome.png',
  2: 'step3_motivation.png',
  3: 'step4_availability.png',
  4: 'step6_difficult_customer.png',
  5: 'step7_questions.png',
};
const HERO_IMG = { easy: 'intro_easy.png', medium: 'intro_medium.png', hard: 'intro_hard.png' };
const imgUrl = (name) => (process.env.PUBLIC_URL || '') + '/images/sollicitatie/' + name;

function getPtt() { try { return localStorage.getItem('tt-ptt') === '1'; } catch (e) { return false; } }
function setPttPref(on) { try { localStorage.setItem('tt-ptt', on ? '1' : '0'); } catch (e) {} }
function getDifficulty() {
  try { const d = localStorage.getItem('tt-sanne-difficulty'); return ['easy', 'medium', 'hard'].includes(d) ? d : 'easy'; }
  catch (e) { return 'easy'; }
}
function setDifficultyPref(d) { try { localStorage.setItem('tt-sanne-difficulty', d); } catch (e) {} }

export default function Sollicitatie() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const ui = UI[lang] || UI.nl;
  const interviewLang = ['nl', 'en', 'es'].includes(lang) ? lang : 'nl';

  const [view, setView] = useState('intro'); // intro | live | results | error
  const [step, setStep] = useState(1);
  const [turns, setTurns] = useState([]);
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [sanneSpeaking, setSanneSpeaking] = useState(false);
  const [ptt, setPtt] = useState(getPtt());
  const [difficulty, setDifficulty] = useState(getDifficulty());
  const [recording, setRecording] = useState(false);
  const [posting, setPosting] = useState(false);
  const [posted, setPosted] = useState(false);

  const pttMode = useRef(false);
  const diffMode = useRef('easy');
  const recordingRef = useRef(false);
  const recordedFrames = useRef(0);
  const ws = useRef(null);
  const capture = useRef(null);
  const playback = useRef(null);
  const mediaStream = useRef(null);
  const running = useRef(false);
  const endResult = useRef(null);
  const transcriptBox = useRef(null);

  useEffect(() => () => { stop(); /* cleanup on unmount */ // eslint-disable-next-line
  }, []);
  // Keep the transcript pinned to the bottom by scrolling ONLY the transcript box,
  // never the page (scrollIntoView would push the whole window down on each delta).
  useEffect(() => { const b = transcriptBox.current; if (b) b.scrollTop = b.scrollHeight; }, [turns]);

  // ── transcript helpers ──
  function appendDelta(role, delta) {
    if (!delta) return;
    setTurns((prev) => {
      const arr = prev.slice();
      const last = arr[arr.length - 1];
      if (last && last.role === role && !last.done) arr[arr.length - 1] = { ...last, text: last.text + delta };
      else arr.push({ role, text: delta, done: false });
      return arr;
    });
  }
  function finalizeRole(role) {
    setTurns((prev) => {
      const arr = prev.slice();
      const last = arr[arr.length - 1];
      if (last && last.role === role && !last.done) arr[arr.length - 1] = { ...last, done: true };
      return arr;
    });
  }
  function setUserFinal(text) {
    if (!text) return;
    setTurns((prev) => {
      const arr = prev.slice();
      const last = arr[arr.length - 1];
      if (last && last.role === 'user' && !last.done) arr[arr.length - 1] = { role: 'user', text, done: true };
      else arr.push({ role: 'user', text, done: true });
      return arr;
    });
  }

  function showError(msg) { setErrorMsg(msg || ui.errGeneric); setView('error'); }

  // ── frame handling (handles both gpt-realtime-1.5 and v1 event names) ──
  function handleFrame(raw) {
    let evt;
    try { evt = JSON.parse(raw); } catch (e) { return; }
    const etype = evt.type || '';
    if (etype === 'response.created') { setSanneSpeaking(true); return; }
    if ((etype === 'response.audio.delta' || etype === 'response.output_audio.delta') && evt.delta) {
      if (playback.current) playback.current.playB64(evt.delta);
      return;
    }
    if (etype === 'response.audio_transcript.delta' || etype === 'response.output_audio_transcript.delta') { appendDelta('sanne', evt.delta || ''); return; }
    if (etype === 'response.audio_transcript.done' || etype === 'response.output_audio_transcript.done') { finalizeRole('sanne'); return; }
    if (etype === 'response.done') { finalizeRole('sanne'); setSanneSpeaking(false); return; }
    if (etype === 'conversation.item.input_audio_transcription.delta') { appendDelta('user', evt.delta || ''); return; }
    if (etype === 'conversation.item.input_audio_transcription.completed') { setUserFinal(((evt.transcript || '') + '').trim()); return; }
    if (etype === 'sollicitatie.tool_call' && evt.data) {
      const tc = evt.data; const name = tc.name || ''; const args = tc.arguments || {};
      if (name === 'advance_to_step') {
        const n = parseInt(args.step, 10);
        if (!isNaN(n) && n >= 1 && n <= N_STEPS) setStep(n);
      } else if (name === 'end_interview') {
        endResult.current = args; running.current = false; setResult(args); setPosted(false); setView('results');
      }
      return;
    }
    if (etype === 'sollicitatie.error' && evt.data) { showError(evt.data.message); return; }
  }

  // ── push-to-talk controls ──
  function startRecording() {
    if (recordingRef.current || sanneSpeaking) return;
    if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
    recordingRef.current = true; recordedFrames.current = 0; setRecording(true);
  }
  function stopRecording() {
    if (!recordingRef.current) return;
    recordingRef.current = false; setRecording(false);
    if (ws.current && ws.current.readyState === WebSocket.OPEN && recordedFrames.current > 0) {
      try {
        ws.current.send(JSON.stringify({ type: 'input_audio_buffer.commit' }));
        ws.current.send(JSON.stringify({ type: 'response.create' }));
      } catch (e) {}
    }
    recordedFrames.current = 0;
  }
  function toggleTalk() { if (recordingRef.current) stopRecording(); else startRecording(); }

  // ── start / stop ──
  async function start() {
    if (running.current) return;
    running.current = true;
    endResult.current = null;
    pttMode.current = getPtt();
    diffMode.current = difficulty;
    recordingRef.current = false; recordedFrames.current = 0; setRecording(false);
    setResult(null); setTurns([]); setStep(1); setSanneSpeaking(false); setPosted(false); setView('live');

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) { showError(ui.errMic); running.current = false; return; }
    try { mediaStream.current = await navigator.mediaDevices.getUserMedia({ audio: true }); }
    catch (e) { showError(ui.errMic); running.current = false; return; }

    const sendFrame = (b64) => {
      if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
      ws.current.send(JSON.stringify({ type: 'input_audio_buffer.append', audio: b64 }));
      recordedFrames.current++;
    };
    const shouldSend = () => !pttMode.current || recordingRef.current;
    capture.current = await createCapture(mediaStream.current, sendFrame, shouldSend);
    if (!capture.current) { showError(ui.errMic); running.current = false; await cleanupAudio(); return; }

    playback.current = createPlayback();
    playback.current.start();

    const scheme = window.location.protocol === 'https:' ? 'wss' : 'ws';
    const pttQs = pttMode.current ? '1' : '0';
    try {
      ws.current = new WebSocket(`${scheme}://${window.location.host}/api/sollicitatie?lang=${interviewLang}&ptt=${pttQs}&difficulty=${diffMode.current}`);
    } catch (e) { showError(ui.errGeneric); await cleanupAudio(); running.current = false; return; }
    ws.current.binaryType = 'arraybuffer';
    ws.current.onmessage = (evt) => handleFrame(evt.data);
    ws.current.onerror = () => { if (running.current) showError(ui.errGeneric); };
    ws.current.onclose = () => {
      if (running.current && !endResult.current) showError(ui.errGeneric);
      running.current = false; setSanneSpeaking(false);
      cleanupAudio();
    };
  }

  async function cleanupAudio() {
    try { capture.current && (await capture.current.teardown()); } catch (e) {}
    capture.current = null;
    try { playback.current && (await playback.current.stop()); } catch (e) {}
    playback.current = null;
    if (mediaStream.current) { try { mediaStream.current.getTracks().forEach((t) => t.stop()); } catch (e) {} mediaStream.current = null; }
  }

  async function stop() {
    const was = running.current;
    running.current = false;
    setSanneSpeaking(false);
    recordingRef.current = false; setRecording(false); recordedFrames.current = 0;
    try { ws.current && ws.current.close(); } catch (e) {}
    ws.current = null;
    await cleanupAudio();
    if (was && !endResult.current) setView('intro');
  }

  async function placeOnBoard() {
    if (!result || posting) return;
    setPosting(true);
    try {
      await fetch('/api/leaderboard', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ game: 'sollicitatie', ...result }),
      });
      setPosted(true);
    } catch (e) {}
    setPosting(false);
    navigate('/leaderboard', { state: { game: 'sollicitatie', difficulty: result.difficulty || diffMode.current, highlightId: result.id } });
  }

  // ── render ──
  const grade = result && typeof result.grade === 'number' ? result.grade : NaN;
  const accepted = Number.isFinite(grade) ? grade >= 5.5 : !!(result && result.accepted);
  const gradeStr = Number.isFinite(grade) ? grade.toFixed(1).replace('.', ',') : '–';
  const heroSrc = imgUrl(HERO_IMG[difficulty] || HERO_IMG.medium);

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
              <div className="rounded-2xl overflow-hidden mb-4">
                <img src={heroSrc} alt="Sanne" className="w-full max-h-[30vh] object-cover" loading="lazy"
                  onError={(e) => { if (!e.currentTarget.dataset.fb) { e.currentTarget.dataset.fb = '1'; e.currentTarget.src = imgUrl('step1_welcome.png'); } }} />
              </div>
              <h2 className="text-[18px] font-bold text-gray-900 mb-2">{ui.introTitle}</h2>
              <p className="text-sm text-gray-600 leading-relaxed mb-4">{ui.introText}</p>
              <p className="text-xs text-gray-400 mb-5">{ui.micHint}</p>

              {/* Difficulty (default easy) */}
              <div className="bg-gray-50 rounded-2xl p-4 mb-3 text-left">
                <p className="text-sm font-bold text-gray-900 mb-1">{ui.diffTitle}</p>
                <p className="text-xs text-gray-500 leading-relaxed mb-3">{ui.diffHint}</p>
                <div className="flex gap-2">
                  {[['easy', ui.diffEasy], ['medium', ui.diffMedium], ['hard', ui.diffHard]].map(([val, label]) => (
                    <button key={val} onClick={() => { setDifficulty(val); setDifficultyPref(val); }}
                      className={`flex-1 rounded-xl py-2.5 text-sm font-bold border-2 transition-colors ${difficulty === val ? 'bg-blue-600 text-white border-blue-700' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Push-to-talk setting (off by default) */}
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
              <div className="relative rounded-2xl overflow-hidden shadow-sm mb-3 bg-white">
                <img src={imgUrl(STEP_IMG[step] || STEP_IMG[1])} alt={ui.steps[step - 1]} className="w-full max-h-[30vh] object-cover block" />
                <div className="absolute left-3 top-3 bg-black/55 text-white rounded-xl px-3 py-1.5">
                  <p className="text-[11px] font-medium opacity-90">{ui.stepLabel} {step} {ui.stepOf} {N_STEPS}</p>
                  <p className="text-[13px] font-bold leading-tight">{ui.steps[step - 1]}</p>
                </div>
                <div className={`absolute right-3 top-3 rounded-full px-3 py-1.5 text-[12px] font-bold ${sanneSpeaking ? 'bg-blue-600 text-white' : 'bg-white/85 text-blue-700'}`}>{sanneSpeaking ? ui.talking : ui.listening}</div>
              </div>
              <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden mb-3">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${(step / N_STEPS) * 100}%` }} />
              </div>

              <div ref={transcriptBox} className="bg-white rounded-2xl p-4 shadow-sm mb-3 max-h-[34vh] overflow-y-auto">
                {turns.length === 0 && <p className="text-sm text-gray-400 text-center py-6">…</p>}
                {turns.map((turn, i) => turn.text ? (
                  <div key={i} className={`mb-2 ${turn.role === 'user' ? 'text-right' : 'text-left'}`}>
                    <span className={`text-[11px] font-bold ${turn.role === 'user' ? 'text-blue-600' : 'text-gray-500'}`}>{turn.role === 'user' ? ui.you : ui.sanne}</span>
                    <p className={`text-sm font-medium inline-block px-3 py-2 rounded-2xl mt-0.5 ${turn.role === 'user' ? 'bg-blue-50 text-gray-900' : 'bg-gray-100 text-gray-900'}`}>{turn.text}</p>
                  </div>
                ) : null)}
              </div>

              {ptt && (
                <button onClick={toggleTalk} disabled={sanneSpeaking && !recording}
                  className={`w-full max-w-sm mx-auto block border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors mb-2.5 ${recording ? 'bg-red-600 text-white animate-pulse' : (sanneSpeaking ? 'bg-gray-300 text-gray-600 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white')}`}>
                  {recording ? ui.send : (sanneSpeaking ? ui.wait : ui.talk)}
                </button>
              )}
              <button onClick={stop} className="w-full max-w-sm mx-auto block bg-red-600 hover:bg-red-700 active:bg-red-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors">{ui.stop}</button>
            </div>
          )}

          {/* Results */}
          {view === 'results' && result && (
            <div>
              <div className="rounded-2xl overflow-hidden shadow-sm mb-3 bg-white">
                <img src={imgUrl('results.png')} alt="" className="w-full max-h-[20vh] object-cover block" />
              </div>
              <div className={`rounded-2xl p-5 shadow-sm text-center mb-3 ${accepted ? 'bg-blue-600' : 'bg-blue-100'}`}>
                <p className={`text-2xl font-extrabold ${accepted ? 'text-white' : 'text-blue-700'}`}>{accepted ? ui.accepted : ui.rejected}</p>
                <p className={`text-sm font-bold mt-1 ${accepted ? 'text-white/90' : 'text-blue-700/80'}`}>{ui.grade} {gradeStr}</p>
              </div>

              {/* Sub-scores */}
              {result.scores && (
                <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">
                  <h3 className="text-sm font-bold text-gray-900 mb-3">{ui.scoresTitle}</h3>
                  {SUB_KEYS.map((k) => {
                    const v = Number(result.scores[k]) || 0;
                    return (
                      <div key={k} className="mb-2.5 last:mb-0">
                        <div className="flex justify-between text-xs font-medium text-gray-700 mb-1">
                          <span>{ui.subScores[k]}</span><span className="text-gray-500">{v.toFixed(1).replace('.', ',')}</span>
                        </div>
                        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.max(0, Math.min(10, v)) * 10}%` }} />
                        </div>
                      </div>
                    );
                  })}
                  <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100 text-sm">
                    <span className="text-gray-600">{ui.bonusLabel}</span>
                    <span className="font-bold text-blue-600">+{(Number(result.difficulty_bonus) || 0).toFixed(1).replace('.', ',')}</span>
                  </div>
                  <div className="flex justify-between items-center mt-1 text-sm">
                    <span className="font-bold text-gray-900">{ui.totalLabel}</span>
                    <span className="font-extrabold text-blue-700 text-lg">{(Number(result.leaderboard_points) || 0).toFixed(1).replace('.', ',')}</span>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{ui.good}</h3>
                  <ul className="space-y-1.5">{(result.positives || []).map((p, i) => <li key={i} className="text-sm text-gray-700 leading-snug">• {p}</li>)}</ul>
                </div>
                <div className="bg-white rounded-2xl p-4 shadow-sm">
                  <h3 className="text-sm font-bold text-gray-900 mb-2">{ui.better}</h3>
                  <ul className="space-y-1.5">{(result.improvements || []).map((p, i) => <li key={i} className="text-sm text-gray-700 leading-snug">• {p}</li>)}</ul>
                </div>
              </div>

              <button onClick={placeOnBoard} disabled={posting}
                className="w-full max-w-sm mx-auto block bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors mb-2.5 disabled:opacity-60">
                {posting ? ui.placing : (posted ? ui.viewBoard : ui.place)}
              </button>
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

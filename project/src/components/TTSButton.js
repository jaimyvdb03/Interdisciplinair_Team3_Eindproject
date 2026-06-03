import { useRef, useState } from 'react';

// Reads the supplied text aloud in Dutch via the server's /api/tts proxy
// (which calls Azure gpt-audio-1.5). Click again while playing to stop.
export default function TTSButton({ getText, className = '', label = 'Lees voor', stopLabel = 'Stop voorlezen' }) {
  const [state, setState] = useState('idle'); // idle | loading | playing
  const audioRef = useRef(null);

  const stop = () => {
    const a = audioRef.current;
    if (a) {
      try { a.pause(); } catch (e) {}
      audioRef.current = null;
    }
    setState('idle');
  };

  const play = async () => {
    const text = (getText && getText()) || '';
    if (!text.trim()) return;
    setState('loading');
    try {
      const resp = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      if (!resp.ok) {
        console.error('[tts] /api/tts', resp.status, await resp.text().catch(() => ''));
        setState('idle');
        return;
      }
      const data = await resp.json();
      if (!data || !data.audio) { setState('idle'); return; }
      const src = `data:audio/${data.format || 'wav'};base64,${data.audio}`;
      const audio = new Audio(src);
      audioRef.current = audio;
      audio.onended = () => { audioRef.current = null; setState('idle'); };
      audio.onerror  = () => { audioRef.current = null; setState('idle'); };
      await audio.play();
      setState('playing');
    } catch (e) {
      console.error('[tts] failed', e);
      setState('idle');
    }
  };

  const onClick = () => {
    if (state === 'playing' || state === 'loading') stop();
    else play();
  };

  const isBusy = state !== 'idle';

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={state === 'playing'}
      aria-label={isBusy ? stopLabel : label}
      className={
        'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-semibold shadow-sm whitespace-nowrap border ' +
        (isBusy
          ? 'bg-blue-600 text-white border-blue-700 '
          : 'bg-white text-gray-700 border-gray-200 ') +
        className
      }
    >
      {state === 'loading' ? (
        <span className="inline-block w-3 h-3 rounded-full border-2 border-current border-t-transparent animate-spin" />
      ) : state === 'playing' ? (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <rect x="6" y="6" width="12" height="12" rx="2" />
        </svg>
      ) : (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M4 10v4h3l4 3V7l-4 3H4z" />
          <path d="M14 9c1.2 1 1.2 5 0 6" />
          <path d="M17 7c2 1.5 2 8 0 10" />
        </svg>
      )}
      <span>{isBusy ? stopLabel : label}</span>
    </button>
  );
}

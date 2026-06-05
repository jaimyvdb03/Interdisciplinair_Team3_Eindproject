import { useCallback, useEffect, useRef, useState } from 'react';

// useReadAloud — Web Speech API hook that returns a charIndex while speaking
// so the UI can highlight the current word. The browser handles the Dutch
// voice; nothing leaves the device.
export function useReadAloud(lang = 'nl-NL', rate = 0.95) {
  const [state, setState] = useState({ playing: false, charIndex: -1, text: '' });
  const utterRef = useRef(null);

  const stop = useCallback(() => {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
    utterRef.current = null;
    setState({ playing: false, charIndex: -1, text: '' });
  }, []);

  const start = useCallback((text) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = rate;
    u.onboundary = (e) => {
      // Some browsers only fire boundaries for words.
      const idx = typeof e.charIndex === 'number' ? e.charIndex : 0;
      setState((s) => (s.text === text ? { ...s, charIndex: idx } : s));
    };
    u.onend = () => {
      if (utterRef.current === u) {
        utterRef.current = null;
        setState({ playing: false, charIndex: -1, text: '' });
      }
    };
    u.onerror = () => {
      if (utterRef.current === u) {
        utterRef.current = null;
        setState({ playing: false, charIndex: -1, text: '' });
      }
    };
    utterRef.current = u;
    setState({ playing: true, charIndex: 0, text });
    try { window.speechSynthesis.speak(u); } catch (e) { stop(); }
  }, [lang, rate, stop]);

  useEffect(() => () => {
    try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {}
  }, []);

  const toggle = useCallback((text) => {
    if (state.playing) stop();
    else start(text);
  }, [state.playing, start, stop]);

  return { ...state, start, stop, toggle };
}

// Splits text into word/whitespace tokens and highlights the word that contains
// charIndex (offset by baseOffset). Whitespace passes through unchanged.
export function HighlightedText({ text, charIndex = -1, baseOffset = 0, className = '' }) {
  const tokens = [];
  let i = 0;
  while (i < text.length) {
    const ws = /\s/.test(text.charAt(i));
    let j = i;
    while (j < text.length && /\s/.test(text.charAt(j)) === ws) j++;
    tokens.push({ s: i, e: j, ws });
    i = j;
  }
  const rel = charIndex - baseOffset;
  const active = charIndex >= 0;
  return (
    <span className={className}>
      {tokens.map((t, idx) => {
        const piece = text.slice(t.s, t.e);
        if (t.ws) return <span key={idx}>{piece}</span>;
        const hit = active && rel >= t.s && rel < t.e;
        return (
          <span
            key={idx}
            className={hit ? 'bg-yellow-200 rounded px-0.5 transition-colors duration-100' : ''}
          >
            {piece}
          </span>
        );
      })}
    </span>
  );
}

// SpeakBtn — small inline trigger that starts/stops reading a known string.
export function SpeakBtn({ getText, playing, onToggle, className = '' }) {
  return (
    <button
      type="button"
      onClick={() => onToggle(getText())}
      aria-pressed={playing}
      className={
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border-none cursor-pointer whitespace-nowrap shrink-0 ' +
        (playing ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600') + ' ' + className
      }
    >
      {playing ? '⏹ Stop' : '🔊 Luister'}
    </button>
  );
}

import { useCallback, useEffect, useState } from 'react';

// Maps the app's language code to a BCP-47 voice tag for the Web Speech API.
const VOICE = { nl: 'nl-NL', en: 'en-GB', es: 'es-ES', tr: 'tr-TR', ar: 'ar-SA' };

export function langToVoice(lang) {
  return VOICE[lang] || 'nl-NL';
}

// useSpeech — reads text aloud in the current language via the browser's
// built-in speech synthesis. No server round-trip, works offline.
export function useSpeech(lang) {
  const [playing, setPlaying] = useState(false);

  const stop = useCallback(() => {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
    setPlaying(false);
  }, []);

  const speak = useCallback((text) => {
    if (!text || typeof window === 'undefined' || !window.speechSynthesis) return;
    try {
      window.speechSynthesis.cancel();
      const u = new window.SpeechSynthesisUtterance(text);
      u.lang = langToVoice(lang);
      u.rate = 0.95;
      u.onend = () => setPlaying(false);
      u.onerror = () => setPlaying(false);
      setPlaying(true);
      window.speechSynthesis.speak(u);
    } catch (e) {
      setPlaying(false);
    }
  }, [lang]);

  // Cancel any ongoing speech when the component unmounts.
  useEffect(() => () => {
    try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch (e) {}
  }, []);

  const toggle = useCallback((text) => {
    if (playing) stop();
    else speak(text);
  }, [playing, speak, stop]);

  return { playing, speak, stop, toggle };
}

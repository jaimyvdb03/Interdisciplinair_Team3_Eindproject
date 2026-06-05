import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import { useSpeech } from '../speech';

// Reads the supplied `text` aloud in the current app language. `label` is the
// idle label (e.g. "🔊 Luister"); while playing it switches to a stop label.
export default function AudioBtn({ label, text }) {
  const { lang } = useLanguage();
  const t = translations[lang] || translations.nl;
  const { playing, toggle } = useSpeech(lang);

  return (
    <button
      type="button"
      onClick={() => toggle(text || '')}
      aria-pressed={playing}
      className={
        'flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm border-none cursor-pointer whitespace-nowrap shrink-0 transition-colors ' +
        (playing ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500')
      }
    >
      {playing ? (t.common.stop || '⏹ Stop') : label}
    </button>
  );
}

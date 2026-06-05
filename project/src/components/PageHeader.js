import { useNavigate } from 'react-router-dom';
import LangPicker from './LangPicker';
import { useLanguage } from '../context/LanguageContext';
import { useSpeech } from '../speech';

export default function PageHeader({ title, onBack, step, total, titleClass = '', audioText }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const { playing, toggle } = useSpeech(lang);

  return (
    <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
      <button
        onClick={onBack}
        className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
      >
        ‹
      </button>
      <h1 className={`text-[19px] font-bold text-gray-900 flex-1 ${titleClass}`}>{title}</h1>
      {audioText && (
        <button
          onClick={() => toggle(audioText)}
          aria-label="Lees voor"
          aria-pressed={playing}
          className={`w-[34px] h-[34px] rounded-full border-none flex items-center justify-center text-base cursor-pointer shrink-0 transition-colors ${
            playing ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 active:bg-gray-300'
          }`}
        >
          {playing ? '⏹' : '🔊'}
        </button>
      )}
      <LangPicker />
      <button
        onClick={() => navigate('/')}
        className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
        aria-label="Home"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
          <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
        </svg>
      </button>
      {step != null && <span className="text-sm text-gray-400 font-medium shrink-0">{step} / {total}</span>}
    </div>
  );
}

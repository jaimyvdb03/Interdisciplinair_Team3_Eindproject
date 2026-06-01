import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import LanguagePicker, { LANGUAGES } from './LanguagePicker';

export default function PageHeader({ title, onBack, step, total, titleClass = '' }) {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const [showLangPicker, setShowLangPicker] = useState(false);

  const currentLang = LANGUAGES.find((l) => l.id === lang) || LANGUAGES[0];
  const t = translations[lang];

  return (
    <>
      <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
        <button
          onClick={onBack}
          className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
        >
          ‹
        </button>
        <h1 className={`text-[19px] font-bold text-gray-900 flex-1 ${titleClass}`}>{title}</h1>
        <button
          onClick={() => setShowLangPicker(true)}
          className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm whitespace-nowrap cursor-pointer shrink-0"
        >
          <img src={currentLang.flagSrc} alt={currentLang.label} className="w-4 h-4 rounded-full object-cover" />
          {t.home.langLabel}
        </button>
        <button
          onClick={() => navigate('/')}
          className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-base text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
        >
          🏠
        </button>
        {step != null && <span className="text-base text-gray-400 font-medium shrink-0">{step} / {total}</span>}
      </div>
      {showLangPicker && <LanguagePicker onClose={() => setShowLangPicker(false)} />}
    </>
  );
}

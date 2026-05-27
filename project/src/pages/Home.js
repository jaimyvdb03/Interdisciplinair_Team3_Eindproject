import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../iconPaths';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import HelpPopup from '../components/HelpPopup';

const PROGRESS  = 40; //Verander later, nu hardcoded 
const COMPLETED = 2;
const TOTAL     = 11;


const LANGUAGES = [
  { id: 'nl', flagSrc: 'https://flagcdn.com/nl.svg', label: 'Nederlands' },
  { id: 'es', flagSrc: 'https://flagcdn.com/es.svg', label: 'Español'    },
  { id: 'en', flagSrc: 'https://flagcdn.com/gb.svg', label: 'English'    },
  { id: 'tr', flagSrc: 'https://flagcdn.com/tr.svg', label: 'Türkçe'     },
  { id: 'ar', flagSrc: 'https://flagcdn.com/sa.svg', label: 'العربية'    },
];

export default function Home() {
  const navigate = useNavigate();
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [showLangPicker, setShowLangPicker] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const MENU = [
    { icon: ICONS.lessen,     to: '/lessen',     label: t.home.menu[0].label, sub: t.home.menu[0].sub },
    { icon: ICONS.video,      to: '/video',       label: t.home.menu[1].label, sub: t.home.menu[1].sub },
    { icon: ICONS.oefeningen, to: '/oefeningen',  label: t.home.menu[2].label, sub: t.home.menu[2].sub },
    { icon: ICONS.hulp,       to: '/hulp',        label: t.home.menu[3].label, sub: t.home.menu[3].sub },
  ];

  let currentLang = LANGUAGES[0];
  LANGUAGES.forEach(language => {
    if (language.id === lang) currentLang = language;
  });

  const menuCards = [];
  for (let i = 0; i < MENU.length; i++) {
    const item = MENU[i];
    menuCards[i] = (
      <button
        key={item.label}
        onClick={() => navigate(item.to)}
        className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 cursor-pointer text-left w-full shadow-sm border-none active:scale-[0.98] transition-transform"
      >
        <img src={item.icon} alt={item.label + ' icoon'} className="w-12 h-12 object-contain shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-[15px] font-bold text-gray-900 leading-tight">{item.label}</p>
          <p className="text-xs text-gray-400 mt-0.5 leading-tight">{item.sub}</p>
        </div>
        <span className="text-xl text-gray-300 shrink-0">›</span>
      </button>
    );
  }

  const languageButtons = [];
  for (let i = 0; i < LANGUAGES.length; i++) {
    const language = LANGUAGES[i];
    languageButtons[i] = (
      <button
        key={language.id}
        onClick={() => { setLang(language.id); setShowLangPicker(false); }}
        className={`flex items-center gap-4 rounded-2xl px-5 py-3.5 w-full border-2 cursor-pointer transition-colors shadow-sm
          ${lang === language.id
            ? 'bg-blue-50 border-blue-400'
            : 'bg-white hover:bg-gray-50 active:bg-gray-100 border-transparent'
          }`}
      >
        <img src={language.flagSrc} alt={language.label} className="w-10 h-10 rounded-full object-cover shrink-0 shadow-sm" />
        <span className="text-[16px] font-semibold text-gray-900">{language.label}</span>
        {lang === language.id && <span className="ml-auto text-blue-500 text-lg">✓</span>}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">

        {/* Header */}
        <div className="flex items-center gap-2 px-5 pt-6 pb-1 sm:px-0 sm:pt-8">
          <h1 className="text-[22px] font-bold text-gray-900 flex-1">{t.home.welcome}</h1>
          <button
            onClick={() => setShowHelp(true)}
            className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-3 py-1.5 text-xs font-bold shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
            aria-label="Uitleg"
          >
            ❓ {t.home.helpBtn}
          </button>
          <button
            onClick={() => setShowLangPicker(true)}
            className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm whitespace-nowrap"
          >
            <img src={currentLang.flagSrc} alt={currentLang.label} className="w-4 h-4 rounded-full object-cover" />
            {t.home.langLabel}
          </button>
        </div>
        <p className="px-5 pb-4 pt-1 text-sm text-gray-400 sm:px-0">{t.home.subtitle}</p>

        {/* Menu cards - responsive grid */}
        <div className="grid grid-cols-1 gap-2.5 px-4 pb-4 sm:px-0 sm:grid-cols-2">
          {menuCards}
        </div>

        {/* Progress card and CTA */}
        <div className="flex flex-col items-center mt-12 px-4 sm:px-0">
          <div className="w-full max-w-2xl mb-6 rounded-[20px] p-5 sm:rounded-[18px] sm:px-7 sm:py-6 bg-gradient-to-br from-[#4a7cf6] to-[#1a50db] text-white">
            <p className="text-xs font-medium opacity-75 mb-0.5">{t.home.progressLabel}</p>
            <p className="text-[26px] font-extrabold tracking-tight mb-2.5">{t.home.progressPct(PROGRESS)}</p>
            <div className="h-[7px] bg-white/30 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${PROGRESS}%` }} />
            </div>
            <p className="text-xs opacity-75">{t.home.progressSub(COMPLETED, TOTAL)}</p>
          </div>
          <button
            onClick={() => navigate('/lessen')}
            className="w-full max-w-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-[14px] py-4 text-base font-bold cursor-pointer transition-colors"
          >
            {t.home.cta}
          </button>
        </div>

      </div>

      {/* Help popup */}
      {showHelp && <HelpPopup onClose={() => setShowHelp(false)} />}

      {/* Language picker popup */}
      {showLangPicker && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end z-50"
          onClick={() => setShowLangPicker(false)}
        >
          <div
            className="bg-gray-100 rounded-t-3xl pt-4 pb-8 px-4 w-full max-w-[480px] mx-auto sm:rounded-3xl sm:mb-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup header */}
            <div className="flex items-center justify-between mb-5 px-1">
              <button
                onClick={() => setShowLangPicker(false)}
                className="w-9 h-9 rounded-full bg-white border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-200 transition-colors shadow-sm leading-none pb-px"
              >
                ‹
              </button>
              <button className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm text-gray-500 border-none cursor-pointer shadow-sm whitespace-nowrap">
                {t.common.listen}
              </button>
            </div>

            {/* Language options */}
            <div className="flex flex-col gap-2.5">
              {languageButtons}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

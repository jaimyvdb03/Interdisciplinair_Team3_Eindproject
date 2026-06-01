import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ICONS } from '../iconPaths';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';
import HelpPopup from '../components/HelpPopup';
import LangPicker from '../components/LangPicker';

const PROGRESS  = 40; //Verander later, nu hardcoded
const COMPLETED = 2;
const TOTAL     = 11;

export default function Home() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const [showHelp, setShowHelp] = useState(false);

  const MENU = [
    { icon: ICONS.lessen,     to: '/lessen',     label: t.home.menu[0].label, sub: t.home.menu[0].sub },
    { icon: ICONS.video,      to: '/video',       label: t.home.menu[1].label, sub: t.home.menu[1].sub },
    { icon: ICONS.oefeningen, to: '/oefeningen',  label: t.home.menu[2].label, sub: t.home.menu[2].sub },
    { icon: ICONS.hulp,       to: '/hulp',        label: t.home.menu[3].label, sub: t.home.menu[3].sub },
  ];

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
          <p className="text-[17px] font-bold text-gray-900 leading-tight">{item.label}</p>
          <p className="text-sm text-gray-400 mt-0.5 leading-tight">{item.sub}</p>
        </div>
        <span className="text-xl text-gray-300 shrink-0">›</span>
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
            className="flex items-center gap-1.5 bg-orange-50 border border-orange-200 text-orange-700 rounded-xl px-3 py-1.5 text-sm font-bold shadow-sm cursor-pointer shrink-0 whitespace-nowrap"
            aria-label="Uitleg"
          >
            ❓ {t.home.helpBtn}
          </button>
          <LangPicker />
        </div>
        <p className="px-5 pb-4 pt-1 text-base text-gray-400 sm:px-0">{t.home.subtitle}</p>

        {/* Menu cards - responsive grid */}
        <div className="grid grid-cols-1 gap-2.5 px-4 pb-4 sm:px-0 sm:grid-cols-2">
          {menuCards}
        </div>

        {/* Progress card and CTA */}
        <div className="flex flex-col items-center mt-12 px-4 sm:px-0">
          <div className="w-full max-w-2xl mb-6 rounded-[20px] p-5 sm:rounded-[18px] sm:px-7 sm:py-6 bg-gradient-to-br from-[#4a7cf6] to-[#1a50db] text-white">
            <p className="text-sm font-medium opacity-75 mb-0.5">{t.home.progressLabel}</p>
            <p className="text-[26px] font-extrabold tracking-tight mb-2.5">{t.home.progressPct(PROGRESS)}</p>
            <div className="h-[7px] bg-white/30 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${PROGRESS}%` }} />
            </div>
            <p className="text-sm opacity-75">{t.home.progressSub(COMPLETED, TOTAL)}</p>
          </div>
          <button
            onClick={() => navigate('/lessen')}
            className="w-full max-w-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-[14px] py-4 text-base font-bold cursor-pointer transition-colors"
          >
            {t.home.cta}
          </button>
        </div>

      </div>

      {showHelp && <HelpPopup onClose={() => setShowHelp(false)} />}
    </div>
  );
}

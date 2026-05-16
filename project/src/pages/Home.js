import { useNavigate } from 'react-router-dom';
import { ICONS } from '../iconPaths';

const PROGRESS  = 40;
const COMPLETED = 2;
const TOTAL     = 11;

const MENU = [
  { label: 'Lessen',       sub: 'Lees en luister  ·  Tekst & Audio', icon: ICONS.lessen,      iconBg: 'bg-red-50',     to: '/lessen'     },
  { label: 'Video lessen', sub: 'Kijk en luister  ·  Video',         icon: ICONS.video,       iconBg: 'bg-blue-100',   to: '/video'      },
  { label: 'Oefeningen',   sub: 'Probeer het zelf',                  icon: ICONS.oefeningen,  iconBg: 'bg-purple-100', to: '/oefeningen' },
  { label: 'Hulp nodig?',  sub: 'Stel je vraag',                     icon: ICONS.hulp,        iconBg: 'bg-teal-100',   to: '/hulp'       },
];

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">

        {/* Header */}
        <div className="flex justify-between items-center px-5 pt-6 pb-1 sm:px-0 sm:pt-8">
          <h1 className="text-[22px] font-bold text-gray-900">Welkom terug! 👋</h1>
          <button className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-gray-700 shadow-sm whitespace-nowrap">
            🇳🇱 NL
          </button>
        </div>
        <p className="px-5 pb-4 pt-1 text-sm text-gray-400 sm:px-0">Klaar om verder te leren?</p>

        {/* Menu cards - responsive grid */}
        <div className="grid grid-cols-1 gap-2.5 px-4 pb-4 sm:px-0 sm:grid-cols-2">
          {/* First row: Lessen & Video lessen */}
          <button
            key={MENU[0].label}
            onClick={() => navigate(MENU[0].to)}
            className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 cursor-pointer text-left w-full shadow-sm border-none active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-[13px] flex items-center justify-center shrink-0 ${MENU[0].iconBg}`}>
              <img src={MENU[0].icon} alt={MENU[0].label + ' icoon'} className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900 leading-tight">{MENU[0].label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{MENU[0].sub}</p>
            </div>
            <span className="text-xl text-gray-300 shrink-0">›</span>
          </button>
          <button
            key={MENU[1].label}
            onClick={() => navigate(MENU[1].to)}
            className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 cursor-pointer text-left w-full shadow-sm border-none active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-[13px] flex items-center justify-center shrink-0 ${MENU[1].iconBg}`}>
              <img src={MENU[1].icon} alt={MENU[1].label + ' icoon'} className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900 leading-tight">{MENU[1].label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{MENU[1].sub}</p>
            </div>
            <span className="text-xl text-gray-300 shrink-0">›</span>
          </button>
          {/* Second row: Oefeningen & Hulp nodig? */}
          <button
            key={MENU[2].label}
            onClick={() => navigate(MENU[2].to)}
            className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 cursor-pointer text-left w-full shadow-sm border-none active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-[13px] flex items-center justify-center shrink-0 ${MENU[2].iconBg}`}>
              <img src={MENU[2].icon} alt={MENU[2].label + ' icoon'} className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900 leading-tight">{MENU[2].label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{MENU[2].sub}</p>
            </div>
            <span className="text-xl text-gray-300 shrink-0">›</span>
          </button>
          <button
            key={MENU[3].label}
            onClick={() => navigate(MENU[3].to)}
            className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 cursor-pointer text-left w-full shadow-sm border-none active:scale-[0.98] transition-transform"
          >
            <div className={`w-12 h-12 rounded-[13px] flex items-center justify-center shrink-0 ${MENU[3].iconBg}`}>
              <img src={MENU[3].icon} alt={MENU[3].label + ' icoon'} className="w-8 h-8 object-contain" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[15px] font-bold text-gray-900 leading-tight">{MENU[3].label}</p>
              <p className="text-xs text-gray-400 mt-0.5 leading-tight">{MENU[3].sub}</p>
            </div>
            <span className="text-xl text-gray-300 shrink-0">›</span>
          </button>
        </div>

        {/* Progress card and CTA further down, wider on desktop, padded on mobile */}
        <div className="flex flex-col items-center mt-12 px-4 sm:px-0">
          <div className="w-full max-w-2xl mb-6 rounded-[20px] p-5 sm:rounded-[18px] sm:px-7 sm:py-6 bg-gradient-to-br from-[#4a7cf6] to-[#1a50db] text-white">
            <p className="text-xs font-medium opacity-75 mb-0.5">Je voortgang</p>
            <p className="text-[26px] font-extrabold tracking-tight mb-2.5">{PROGRESS}% voltooid</p>
            <div className="h-[7px] bg-white/30 rounded-full mb-2 overflow-hidden">
              <div className="h-full bg-white rounded-full" style={{ width: `${PROGRESS}%` }} />
            </div>
            <p className="text-xs opacity-75">{COMPLETED} van {TOTAL} lessen afgerond</p>
          </div>
          <button
            onClick={() => navigate('/lessen')}
            className="w-full max-w-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-[14px] py-4 text-base font-bold cursor-pointer transition-colors"
          >
            Ga verder
          </button>
        </div>

      </div>
    </div>
  );
}

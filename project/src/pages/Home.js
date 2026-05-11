import { useNavigate } from 'react-router-dom';

const PROGRESS  = 40;
const COMPLETED = 2;
const TOTAL     = 11;

const MENU = [
  { label: 'Lessen',       sub: 'Lees en luister  ·  Tekst & Audio', icon: '📖', iconBg: 'bg-red-50',     to: '/lessen'     },
  { label: 'Video lessen', sub: 'Kijk en luister  ·  Video',          icon: '▶️', iconBg: 'bg-blue-100',   to: '/video'      },
  { label: 'Oefeningen',   sub: 'Probeer het zelf',                   icon: '🧩', iconBg: 'bg-purple-100', to: '/oefeningen' },
  { label: 'Hulp nodig?',  sub: 'Stel je vraag',                      icon: '💬', iconBg: 'bg-teal-100',   to: '/hulp'       },
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

        {/* Menu cards */}
        <div className="flex flex-col gap-2.5 px-4 pb-4 sm:px-0">
          {MENU.map((item) => (
            <button
              key={item.label}
              onClick={() => navigate(item.to)}
              className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 cursor-pointer text-left w-full shadow-sm border-none active:scale-[0.98] transition-transform"
            >
              <div className={`w-12 h-12 rounded-[13px] flex items-center justify-center text-2xl shrink-0 ${item.iconBg}`}>
                {item.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[15px] font-bold text-gray-900 leading-tight">{item.label}</p>
                <p className="text-xs text-gray-400 mt-0.5 leading-tight">{item.sub}</p>
              </div>
              <span className="text-xl text-gray-300 shrink-0">›</span>
            </button>
          ))}
        </div>

        {/* Progress card */}
        <div className="mx-4 mb-3.5 rounded-[20px] p-5 sm:mx-0 sm:rounded-[18px] sm:px-7 sm:py-6 bg-gradient-to-br from-[#4a7cf6] to-[#1a50db] text-white">
          <p className="text-xs font-medium opacity-75 mb-0.5">Je voortgang</p>
          <p className="text-[26px] font-extrabold tracking-tight mb-2.5">{PROGRESS}% voltooid</p>
          <div className="h-[7px] bg-white/30 rounded-full mb-2 overflow-hidden">
            <div className="h-full bg-white rounded-full" style={{ width: `${PROGRESS}%` }} />
          </div>
          <p className="text-xs opacity-75">{COMPLETED} van {TOTAL} lessen afgerond</p>
        </div>

        {/* CTA */}
        <button
          onClick={() => navigate('/lessen')}
          className="block w-[calc(100%-2rem)] mx-4 sm:w-full sm:mx-0 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-[14px] py-4 text-base font-bold cursor-pointer transition-colors"
        >
          Ga verder
        </button>

      </div>
    </div>
  );
}

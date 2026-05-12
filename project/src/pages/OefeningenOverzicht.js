import { useNavigate } from 'react-router-dom';

const OEFENINGEN = [
  { id: 1, title: 'Je CV maken',            meta: '1 opdrachten',  icon: '📄', bg: '#dbeafe', status: 'done',   to: '/oefeningen/cv-maken'          },
  { id: 2, title: 'Sollicitatiebrief',       meta: '1 opdrachten',  icon: '📋', bg: '#fef9c3', status: 'done',   to: '/oefeningen/sollicitatiebrief'  },
  { id: 3, title: 'Kleding & gedrag',        meta: '1 opdrachten',  icon: '👔', bg: '#ede9fe', status: 'active', to: '/oefeningen/kleding-gedrag'     },
  { id: 4, title: 'Vacatures zoeken',        meta: '0 opdrachten',  icon: '🔍', bg: '#d1fae5', status: 'wip',    to: null                             },
  { id: 5, title: 'Het sollicitatiegesprek', meta: '0 opdrachten',  icon: '🗣️', bg: '#ffeaea', status: 'wip',    to: null                             },
  { id: 6, title: 'Op tijd komen',           meta: '1 opdrachten',  icon: '⏰', bg: '#f3f4f6', status: 'wip',    to: null                             },
];

export default function OefeningenOverzicht() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">

        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button
            onClick={() => navigate('/')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
          >
            ‹
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">Oefeningen (Tekst en Audio)</h1>
        </div>

        <div className="flex flex-col gap-2.5 px-4 pb-10 sm:px-0">
          {OEFENINGEN.map((oef) => (
            <button
              key={oef.id}
              disabled={oef.status === 'wip'}
              onClick={() => oef.to && navigate(oef.to)}
              className={`flex items-center gap-3.5 rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 text-left w-full border-none transition-transform
                ${oef.status === 'wip'
                  ? 'bg-gray-200 shadow-none cursor-default'
                  : 'bg-white shadow-sm cursor-pointer active:scale-[0.98]'
                }`}
            >
              <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-xl shrink-0" style={{ background: oef.bg }}>
                {oef.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-[14.5px] font-semibold leading-tight truncate ${oef.status === 'wip' ? 'text-gray-400' : 'text-gray-900'}`}>
                  {oef.title}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{oef.meta}</p>
              </div>
              {oef.status === 'done'   && <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />}
              {oef.status === 'wip'    && <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />}
              {oef.status === 'active' && <span className="text-xl text-gray-300 shrink-0">›</span>}
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

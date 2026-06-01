import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

const OEFENINGEN_STATIC = [
  { id: 1, icon: '📄', bg: '#dbeafe', status: 'done',   to: '/oefeningen/cv-maken'          },
  { id: 2, icon: '📋', bg: '#fef9c3', status: 'done',   to: '/oefeningen/sollicitatiebrief'  },
  { id: 3, icon: '👔', bg: '#ede9fe', status: 'active', to: '/oefeningen/kleding-gedrag'     },
  { id: 4, icon: '⏰', bg: '#f3f4f6', status: 'active', to: '/oefeningen/op-tijd-komen'      },
  { id: 5, icon: '🔍', bg: '#d1fae5', status: 'wip',    to: null                             },
  { id: 6, icon: '🗣️', bg: '#ffeaea', status: 'wip',    to: null                             },
];

export default function OefeningenOverzicht() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];

  const oefeningenCards = [];
  for (let i = 0; i < OEFENINGEN_STATIC.length; i++) {
    const oef = OEFENINGEN_STATIC[i];
    const text = t.oefeningenOverzicht.oefeningen[i];
    oefeningenCards[i] = (
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
            {text.title}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{text.meta}</p>
        </div>
        {oef.status === 'done'   && <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />}
        {oef.status === 'wip'    && <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />}
        {oef.status === 'active' && <span className="text-xl text-gray-300 shrink-0">›</span>}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">
        <PageHeader title={t.oefeningenOverzicht.pageTitle} onBack={() => navigate('/')} />

        <div className="flex flex-col gap-2.5 px-4 pb-10 sm:px-0">
          {oefeningenCards}
        </div>
      </div>
    </div>
  );
}

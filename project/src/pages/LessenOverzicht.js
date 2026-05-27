import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

const LESSEN_STATIC = [
  { id: 1, icon: '📄', bg: '#dbeafe', status: 'done',   to: '/lessen/cv-maken'          },
  { id: 2, icon: '📋', bg: '#fef9c3', status: 'active', to: '/lessen/sollicitatiebrief'  },
  { id: 3, icon: '👔', bg: '#ede9fe', status: 'active', to: '/lessen/kleding-gedrag'      },
  { id: 4, icon: '⏰', bg: '#f3f4f6', status: 'active', to: '/lessen/op-tijd-komen'      },
  { id: 5, icon: '🔍', bg: '#d1fae5', status: 'wip',    to: null                         },
  { id: 6, icon: '🗣️', bg: '#ffeaea', status: 'wip',    to: null                         },
];

export default function LessenOverzicht() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];

  const lessenCards = [];
  for (let i = 0; i < LESSEN_STATIC.length; i++) {
    const les = LESSEN_STATIC[i];
    const text = t.lessenOverzicht.lessen[i];
    lessenCards[i] = (
      <button
        key={les.id}
        disabled={les.status === 'wip'}
        onClick={() => les.to && navigate(les.to)}
        className={`flex items-center gap-3.5 rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 text-left w-full border-none transition-transform
          ${les.status === 'wip'
            ? 'bg-gray-200 shadow-none cursor-default'
            : 'bg-white shadow-sm cursor-pointer active:scale-[0.98]'
          }`}
      >
        <div className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-xl shrink-0" style={{ background: les.bg }}>
          {les.icon}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-[14.5px] font-semibold leading-tight truncate ${les.status === 'wip' ? 'text-gray-400' : 'text-gray-900'}`}>
            {text.title}
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{text.meta}</p>
        </div>
        {les.status === 'done'   && <span className="w-3 h-3 rounded-full bg-green-500 shrink-0" />}
        {les.status === 'wip'    && <span className="w-3 h-3 rounded-full bg-gray-300 shrink-0" />}
        {les.status === 'active' && <span className="text-xl text-gray-300 shrink-0">›</span>}
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">
        <PageHeader title={t.lessenOverzicht.pageTitle} onBack={() => navigate('/')} />

        <div className="flex flex-col gap-2.5 px-4 pb-10 sm:px-0">
          {lessenCards}
        </div>
      </div>
    </div>
  );
}

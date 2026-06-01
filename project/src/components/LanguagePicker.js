import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export const LANGUAGES = [
  { id: 'nl', flagSrc: 'https://flagcdn.com/nl.svg', label: 'Nederlands' },
  { id: 'en', flagSrc: 'https://flagcdn.com/gb.svg', label: 'English'    },
  { id: 'es', flagSrc: 'https://flagcdn.com/es.svg', label: 'Español'    },
  { id: 'tr', flagSrc: 'https://flagcdn.com/tr.svg', label: 'Türkçe'     },
  { id: 'ar', flagSrc: 'https://flagcdn.com/sa.svg', label: 'العربية'    },
  { id: 'pl', flagSrc: 'https://flagcdn.com/pl.svg', label: 'Polski'     },
  { id: 'uk', flagSrc: 'https://flagcdn.com/ua.svg', label: 'Українська' },
];

export default function LanguagePicker({ onClose }) {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  const buttons = [];
  for (let i = 0; i < LANGUAGES.length; i++) {
    const language = LANGUAGES[i];
    buttons[i] = (
      <button
        key={language.id}
        onClick={() => { setLang(language.id); onClose(); }}
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
    <div
      className="fixed inset-0 bg-black/40 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-100 rounded-t-3xl pt-4 pb-8 px-4 w-full max-w-[480px] mx-auto sm:rounded-3xl sm:mb-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 px-1">
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-200 transition-colors shadow-sm leading-none pb-px"
          >
            ‹
          </button>
          <p className="text-base font-bold text-gray-900">{t.home.langPickerTitle}</p>
          <div className="w-9" />
        </div>
        <div className="flex flex-col gap-2.5">
          {buttons}
        </div>
      </div>
    </div>
  );
}

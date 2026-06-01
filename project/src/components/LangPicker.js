import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

const LANGUAGES = [
  { id: 'nl', flagSrc: 'https://flagcdn.com/nl.svg', label: 'Nederlands' },
  { id: 'es', flagSrc: 'https://flagcdn.com/es.svg', label: 'Español'    },
  { id: 'en', flagSrc: 'https://flagcdn.com/gb.svg', label: 'English'    },
  { id: 'tr', flagSrc: 'https://flagcdn.com/tr.svg', label: 'Türkçe'     },
  { id: 'ar', flagSrc: 'https://flagcdn.com/sa.svg', label: 'العربية'    },
  { id: 'pl', flagSrc: 'https://flagcdn.com/pl.svg', label: 'Polski'     },
  { id: 'uk', flagSrc: 'https://flagcdn.com/ua.svg', label: 'Українська' },
];

export default function LangPicker() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];
  const [open, setOpen] = useState(false);

  const current = LANGUAGES.find(l => l.id === lang) || LANGUAGES[0];

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-sm font-semibold text-gray-700 shadow-sm whitespace-nowrap cursor-pointer"
      >
        <img src={current.flagSrc} alt={current.label} className="w-4 h-4 rounded-full object-cover" />
        {t.home.langLabel}
      </button>

      {open && (
        <div
          className="fixed inset-0 bg-black/40 flex items-end z-50"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-gray-100 rounded-t-3xl pt-4 pb-8 px-4 w-full max-w-[480px] mx-auto sm:rounded-3xl sm:mb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5 px-1">
              <button
                onClick={() => setOpen(false)}
                className="w-9 h-9 rounded-full bg-white border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-200 transition-colors shadow-sm leading-none pb-px"
              >
                ‹
              </button>
              <button className="flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm text-gray-500 border-none cursor-pointer shadow-sm whitespace-nowrap">
                {t.common.listen}
              </button>
            </div>
            <div className="flex flex-col gap-2.5">
              {LANGUAGES.map(language => (
                <button
                  key={language.id}
                  onClick={() => { setLang(language.id); setOpen(false); }}
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
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

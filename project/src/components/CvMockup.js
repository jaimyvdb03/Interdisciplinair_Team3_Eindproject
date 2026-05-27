import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

const sectionLabel = 'font-bold text-[7px] uppercase tracking-wide text-gray-500 mb-0.5';

/** Scaled-down visual CV card matching the Figma design */
export default function CvMockup({ highlight }) {
  const { lang } = useLanguage();
  const m = translations[lang].cvMockup;

  const hl = (section) =>
    highlight === section ? 'bg-yellow-100 rounded' : '';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 text-[7px] leading-tight select-none">
      {/* Header bar */}
      <div className="bg-gray-700 text-white px-3 py-2 flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full bg-gray-400 shrink-0 overflow-hidden flex items-center justify-center text-lg">
          👤
        </div>
        <div>
          <p className="font-bold text-[9px]">Illias Thijssen</p>
          <p className="opacity-70 text-[7px]">{m.jobTitle}</p>
          <p className="opacity-60 text-[6px] mt-0.5">📧 illias@email.nl  📞 06-12345678</p>
        </div>
      </div>

      <div className="flex">
        {/* Left column */}
        <div className="w-2/5 bg-gray-50 p-2 flex flex-col gap-1.5">
          <div>
            <p className={sectionLabel}>{m.languages}</p>
            <p className="text-gray-600">{m.lang1}</p>
            <p className="text-gray-600">{m.lang2}</p>
          </div>
          <div>
            <p className={sectionLabel}>{m.skills}</p>
            <p className="text-gray-600">• {m.skill1}</p>
            <p className="text-gray-600">• {m.skill2}</p>
            <p className="text-gray-600">• {m.skill3}</p>
          </div>
          <div>
            <p className={sectionLabel}>{m.hobbies}</p>
            <p className="text-gray-600">• {m.hobby1}</p>
            <p className="text-gray-600">• {m.hobby2}</p>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          <div className={hl('profiel')}>
            <p className={sectionLabel}>{m.profile}</p>
            <p className="text-gray-600">{m.profileText}</p>
          </div>
          <div className={hl('werkervaring')}>
            <p className={sectionLabel}>{m.experience}</p>
            <p className="font-semibold text-gray-700">{m.expTitle}</p>
            <p className="text-gray-500">{m.expDates}</p>
            <p className="text-gray-600">• {m.task1}</p>
            <p className="text-gray-600">• {m.task2}</p>
          </div>
          <div className={hl('opleiding')}>
            <p className={sectionLabel}>{m.education}</p>
            <p className="font-semibold text-gray-700">{m.eduTitle}</p>
            <p className="text-gray-500">{m.eduDates}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

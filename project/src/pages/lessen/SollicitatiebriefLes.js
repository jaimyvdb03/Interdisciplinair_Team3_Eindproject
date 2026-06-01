import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioBtn from '../../components/AudioBtn';
import PageHeader from '../../components/PageHeader';
import ProgressBar from '../../components/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';

const SECTION_ICONS = ['👋', '📍', '👤', '💼', '⭐', '✉️'];

const LETTER_PARTS = [
  { si: 0, text: 'Beste meneer Jansen,' },
  { si: 1, text: 'Ik zag uw vacature voor logistiek medewerker in het magazijn. De baan spreekt mij aan. Daarom stuur ik deze e-mail.' },
  { si: 2, text: 'Mijn naam is Kevin en ik ben op zoek naar werk. Ik wil graag werken in een magazijn, omdat ik het fijn vind om actief bezig te zijn. Ik werk graag met mijn handen en houd van duidelijk werk. Ook vind ik het belangrijk om netjes en veilig te werken.' },
  { si: 3, text: "Ik heb al ervaring in dit werk. Ik heb gewerkt bij een magazijn van een groot bedrijf. Daar heb ik dozen ingepakt, bestellingen klaargezet en vracht geholpen met laden en lossen. Ook heb ik gewerkt met een scanner om producten te controleren. Ik kan goed samenwerken met collega's en volg instructies goed op." },
  { si: 4, text: 'Wat mij aanspreekt in uw bedrijf is dat het georganiseerd en nettige werkplek is. Ik wil graag meer leren en mij verder ontwikkelen in dit werk. Ik ben gemotiveerd en kom altijd op tijd.' },
  { si: 5, text: 'Graag kom ik langs voor een gesprek om mij verder voor te stellen en meer te horen over de functie.\n\nMijn cv zit in de bijlage. Als u nog vragen heeft, kunt u mij altijd mailen of bellen.\n\nMet vriendelijke groeten,\nKevin Bakker' },
];

function renderStep(step, sl, tc) {

  if (step === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s0.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed">{sl.s0.body}</p>
      </div>
    );
  }

  if (step === 1) {
    const rows = [];
    for (let i = 0; i < LETTER_PARTS.length; i++) {
      const part = LETTER_PARTS[i];
      rows[i] = (
        <div key={i} className="px-3 py-2.5 bg-gray-50 flex gap-3">
          <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
            <span className="text-base leading-none">{SECTION_ICONS[part.si]}</span>
            <span className="text-[10px] text-gray-400 font-medium">{part.si + 1}</span>
          </div>
          <p className="text-base text-gray-700 leading-relaxed whitespace-pre-line">{part.text}</p>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📄</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s1.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-400 mb-3">{sl.letterNote}</p>
        <div className="rounded-xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
          {rows}
        </div>
      </div>
    );
  }

  if (step === 2) {
    const options = [];
    for (let i = 0; i < sl.s2.options.length; i++) {
      const option = sl.s2.options[i];
      options[i] = (
        <div key={option.label} className="bg-gray-50 rounded-xl px-3 py-2">
          <div className="text-[11px] font-semibold text-gray-500 mb-0.5">{option.label}</div>
          <div className="text-base font-medium text-gray-800">{option.example}</div>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{sl.subheading}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👋</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s2.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{sl.s2.intro}</p>
        <div className="space-y-2">{options}</div>
      </div>
    );
  }

  if (step === 3) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{sl.subheading}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">📍</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s3.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{sl.s3.body}</p>
        <div className="bg-gray-50 rounded-xl px-3 py-3">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">{sl.s3.exampleLabel}</div>
          <p className="text-base text-gray-700 italic">{sl.s3.example}</p>
        </div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{sl.subheading}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">👤</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s4.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed">{sl.s4.body}</p>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{sl.subheading}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">💼</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s5.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{sl.s5.body}</p>
        <div className="bg-gray-50 rounded-xl px-3 py-2 text-base text-gray-600">
          <span className="font-semibold text-gray-800">{sl.s5.noExpLabel}</span> {sl.s5.noExp}
        </div>
      </div>
    );
  }

  if (step === 6) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{sl.subheading}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">⭐</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s6.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{sl.s6.body}</p>
        <div className="bg-gray-50 rounded-xl p-3">
          <div className="text-[11px] font-semibold text-gray-500 mb-1">{sl.s6.exampleLabel}</div>
          <p className="text-base text-gray-700 italic leading-relaxed">{sl.s6.example}</p>
        </div>
      </div>
    );
  }

  if (step === 7) {
    const closingOptions = [];
    for (let i = 0; i < sl.s7.closingOptions.length; i++) {
      const option = sl.s7.closingOptions[i];
      closingOptions[i] = (
        <div key={option.label} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between">
          <span className="text-[11px] font-semibold text-gray-500">{option.label}</span>
          <span className="text-base font-medium text-gray-800">{option.example}</span>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <p className="text-xs font-semibold text-gray-400 mb-2 uppercase tracking-wide">{sl.subheading}</p>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">✉️</span>
            <h2 className="text-[18px] font-bold text-gray-900">{sl.s7.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{sl.s7.body1}</p>
        <p className="text-base text-gray-700 leading-relaxed mb-3">
          {sl.s7.body2} <span className="italic">{sl.s7.cvNote}</span>
        </p>
        <div className="space-y-2 mb-3">
          {closingOptions}
        </div>
        <p className="text-base text-gray-600">{sl.s7.formatNote}</p>
      </div>
    );
  }

  return null;
}

export default function SollicitatiebriefLes() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const tc = t.common;
  const sl = t.sollicitatiebriefLes;
  const [step, setStep] = useState(0);
  const total = 8;

  function goNext() {
    if (step === total - 1) {
      navigate('/oefeningen/sollicitatiebrief');
    } else {
      setStep(step + 1);
      window.scrollTo(0, 0);
    }
  }

  function goBack() {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo(0, 0);
    } else {
      navigate('/lessen');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">
        <PageHeader title={sl.pageTitle} onBack={goBack} step={step + 1} total={total} />
        <ProgressBar step={step} total={total} />
        <div className="px-4 sm:px-0">
          {renderStep(step, sl, tc)}
          <div className="mt-4">
            <button
              onClick={goNext}
              className="block w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors"
            >
              {step === total - 1 ? tc.practice : tc.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

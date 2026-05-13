import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CvMockup from '../../components/CvMockup';

function AudioBtn() {
  return (
    <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer whitespace-nowrap shrink-0">
      🔊 Luister
    </button>
  );
}

const STEPS = [
  // 0 — Wat is een CV?
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📋</span>
          <h2 className="text-[16px] font-bold text-gray-900">Wat is een CV?</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Een cv is een overzicht van jezelf. Je zet daarin wie je bent, welk werk je hebt gedaan, welke opleiding je hebt gevolgd en wat je kunt.
      </p>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Werkgevers gebruiken je cv om te zien of je bij de baan past. Hieronder zie je een voorbeeld van een cv. Je hoeft er niet precies aan te houden — je mag zelf kiezen hoe het eruitziet.
      </p>
      <CvMockup />
    </div>
  ),

  // 1 — Persoonlijke informatie
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📇</span>
          <h2 className="text-[16px] font-bold text-gray-900">Persoonlijke informatie</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Een werkgever moet weten wie je bent en hoe hij contact met je kan opnemen. Zet daarom op je cv:
      </p>
      <div className="space-y-2">
        {[
          { icon: '👤', label: 'Je naam' },
          { icon: '📞', label: 'Je telefoonnummer' },
          { icon: '📧', label: 'Je e-mailadres' },
          { icon: '📍', label: 'Je adres (niet verplicht)' },
          { icon: '🖼️', label: 'Een foto van jezelf' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-gray-800">{label}</span>
          </div>
        ))}
      </div>
    </div>
  ),

  // 2 — Jezelf voorstellen
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">😊</span>
          <h2 className="text-[16px] font-bold text-gray-900">Jezelf voorstellen</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Stel jezelf kort voor. Vertel wie je bent en wat je goed kunt. Zo krijgt de werkgever snel een beeld van jou.
      </p>
      <p className="text-xs text-gray-400 mb-2">Op het cv ziet dit er zo uit ↓</p>
      <CvMockup highlight="profiel" />
    </div>
  ),

  // 3 — Werkervaring
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💼</span>
          <h2 className="text-[16px] font-bold text-gray-900">Werkervaring</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-2">
        Schrijf per baan op wanneer je daar hebt gewerkt en wat je daar hebt gedaan.
      </p>
      <div className="bg-gray-50 rounded-xl px-3 py-2 mb-4 text-sm text-gray-600">
        <span className="font-semibold text-gray-800">Geen werkervaring?</span> Dat is oké. Zet dan stages, school of vrijwilligerswerk. Je mag dit onderdeel ook leeg laten.
      </div>
      <p className="text-xs text-gray-400 mb-2">Op het cv ziet dit er zo uit ↓</p>
      <CvMockup highlight="werkervaring" />
    </div>
  ),

  // 4 — Opleiding
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">🎓</span>
          <h2 className="text-[16px] font-bold text-gray-900">Opleiding</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Schrijf op welke school je hebt gezeten of welke studie je hebt gedaan. Zo ziet de werkgever wat je al hebt geleerd.
      </p>
      <p className="text-xs text-gray-400 mb-2">Op het cv ziet dit er zo uit ↓</p>
      <CvMockup highlight="opleiding" />
    </div>
  ),

  // 5 — Extra
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">✨</span>
          <h2 className="text-[16px] font-bold text-gray-900">Extra</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Je kunt ook andere dingen op je cv zetten om een beter beeld te geven van wie je bent:
      </p>
      <div className="space-y-2">
        {[
          { icon: '🌍', label: 'Talen die je spreekt' },
          { icon: '🛠️', label: 'Vaardigheden die je hebt' },
          { icon: '🎯', label: "Hobby's of interesses" },
        ].map(({ icon, label }) => (
          <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
            <span className="text-lg">{icon}</span>
            <span className="text-sm text-gray-800">{label}</span>
          </div>
        ))}
      </div>
    </div>
  ),

  // 6 — Hoe maak je een CV?
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🛠️</span>
          <h2 className="text-[16px] font-bold text-gray-900">Hoe maak je een CV?</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Er is geen vaste manier. Je kunt het op drie manieren doen:
      </p>
      {[
        {
          icon: '✏️', label: 'Op papier',
          steps: ['Pak papier en een pen', 'Schrijf je naam en contactgegevens', 'Schrijf je werk, school en vaardigheden', 'Maak het netjes en duidelijk'],
        },
        {
          icon: '💻', label: 'Op de computer',
          steps: ['Open Word of Google Docs', 'Kies een leeg document of template', 'Typ je naam en contactgegevens', 'Typ je werkervaring en opleiding', 'Sla het op en print of stuur het'],
        },
        {
          icon: '🌐', label: 'Online',
          steps: ['Ga naar een cv-website', 'Kies een template', 'Vul je gegevens in', 'De website maakt je cv aan', 'Download of print je cv'],
        },
      ].map(({ icon, label, steps }) => (
        <div key={label} className="bg-gray-50 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{icon}</span>
            <span className="text-sm font-bold text-gray-800">{label}</span>
          </div>
          <ol className="space-y-1">
            {steps.map((s, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                {s}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </div>
  ),
];

export default function CvMakenLes() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const isLast = step === total - 1;

  function goNext() {
    if (isLast) {
      navigate('/oefeningen/cv-maken');
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

  const StepContent = STEPS[step];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button
            onClick={goBack}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
          >
            ‹
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">Je CV maken</h1>
          <button
            onClick={() => navigate('/')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-base text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
          >
            🏠
          </button>
          <span className="text-sm text-gray-400 font-medium shrink-0">{step + 1} / {total}</span>
        </div>

        {/* Progress bar */}
        <div className="px-4 mb-4 sm:px-0">
          <div className="h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 rounded-full transition-all duration-300"
              style={{ width: `${((step + 1) / total) * 100}%` }}
            />
          </div>
        </div>

        <div className="px-4 sm:px-0">
          <StepContent />
          <div className="mt-4">
            <button
              onClick={goNext}
              className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors"
            >
              {isLast ? 'Oefenen 🎯' : 'Volgende →'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AudioBtn() {
  return (
    <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer whitespace-nowrap shrink-0">
      🔊 Luister
    </button>
  );
}

const SECTIONS = [
  { nr: 1, icon: '👋', label: 'Begroeting'  },
  { nr: 2, icon: '📍', label: 'Inleiding'   },
  { nr: 3, icon: '👤', label: 'Over jezelf' },
  { nr: 4, icon: '💼', label: 'Ervaring'    },
  { nr: 5, icon: '⭐', label: 'Waarom jij?' },
  { nr: 6, icon: '✉️', label: 'Afsluiting'  },
];

const LETTER_PARTS = [
  { si: 0, text: 'Beste meneer Jansen,' },
  { si: 1, text: 'Ik zag uw vacature voor logistiek medewerker in het magazijn. De baan spreekt mij aan. Daarom stuur ik deze e-mail.' },
  { si: 2, text: 'Mijn naam is Kevin en ik ben op zoek naar werk. Ik wil graag werken in een magazijn, omdat ik het fijn vind om actief bezig te zijn. Ik werk graag met mijn handen en hou van duidelijk werk.' },
  { si: 3, text: 'Ik heb al ervaring in dit werk. Ik heb gewerkt bij een magazijn van een groot bedrijf. Daar heb ik dozen ingepakt, bestellingen klaargezet en vracht geholpen met laden en lossen.' },
  { si: 4, text: 'Ik ben gemotiveerd en kom altijd op tijd. Ik wil graag meer leren en mij verder ontwikkelen in dit werk.' },
  { si: 5, text: 'Graag kom ik langs voor een gesprek. Mijn cv zit in de bijlage.\n\nMet vriendelijke groet,\nKevin Bakker' },
];

const STEPS = [
  // 0 — Wat is een sollicitatiebrief?
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📝</span>
          <h2 className="text-[16px] font-bold text-gray-900">Wat is een sollicitatiebrief?</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-4">
        Een sollicitatiebrief is een brief die je stuurt als je op een baan wil solliciteren. Je vertelt wie je bent en waarom jij geschikt bent.
      </p>
      <div className="flex gap-2">
        {[
          { icon: '👤', label: 'Wie ben jij?' },
          { icon: '💡', label: 'Wat kun jij?' },
          { icon: '🏢', label: 'Waarom dit bedrijf?' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex-1 bg-gray-50 rounded-xl py-3 px-2 text-center">
            <div className="text-2xl mb-1">{icon}</div>
            <div className="text-[11px] font-semibold text-gray-600">{label}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // 1 — De 6 onderdelen
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h2 className="text-[16px] font-bold text-gray-900">Een brief heeft 6 onderdelen</h2>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-500 mb-3">In de volgende stappen leer je elk onderdeel.</p>
      <div className="space-y-2">
        {SECTIONS.map((s) => (
          <div key={s.nr} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
            <span className="text-sm font-bold text-gray-400 w-4">{s.nr}.</span>
            <span className="text-lg">{s.icon}</span>
            <span className="text-sm font-semibold text-gray-800">{s.label}</span>
          </div>
        ))}
      </div>
    </div>
  ),

  // 2 — Voorbeeld brief
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">📄</span>
          <h2 className="text-[16px] font-bold text-gray-900">Voorbeeld brief</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-xs text-gray-400 mb-3">Het label links laat zien welk onderdeel het is.</p>
      <div className="rounded-xl overflow-hidden border border-gray-100 divide-y divide-gray-100">
        {LETTER_PARTS.map((part, i) => {
          const s = SECTIONS[part.si];
          return (
            <div key={i} className="px-3 py-2.5 bg-gray-50 flex gap-3">
              <div className="flex flex-col items-center gap-0.5 shrink-0 pt-0.5">
                <span className="text-base leading-none">{s.icon}</span>
                <span className="text-[10px] text-gray-400 font-medium">{s.nr}</span>
              </div>
              <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{part.text}</p>
            </div>
          );
        })}
      </div>
    </div>
  ),

  // 3 — Begroeting
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">👋</span>
          <h2 className="text-[16px] font-bold text-gray-900">1. Begroeting</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">Je begint je mail met een groet.</p>
      <div className="space-y-2">
        {[
          { label: 'Je kent de naam',  example: 'Beste meneer Jansen,' },
          { label: 'Heel formeel',     example: 'Geachte mevrouw / meneer [achternaam],' },
          { label: 'Naam niet bekend', example: 'Geachte heer/mevrouw,' },
        ].map(({ label, example }) => (
          <div key={label} className="bg-gray-50 rounded-xl px-3 py-2">
            <div className="text-[11px] font-semibold text-gray-500 mb-0.5">{label}</div>
            <div className="text-sm font-medium text-gray-800">{example}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // 4 — Inleiding
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">📍</span>
          <h2 className="text-[16px] font-bold text-gray-900">2. Inleiding</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Schrijf kort waar je de vacature hebt gezien. Bijvoorbeeld: op een website, of iemand heeft je erop gewezen.
      </p>
      <div className="bg-gray-50 rounded-xl px-3 py-3">
        <div className="text-[11px] font-semibold text-gray-500 mb-1">Voorbeeld ✏️</div>
        <p className="text-sm text-gray-700 italic">
          "Ik zag uw vacature voor logistiek medewerker op Indeed. De baan spreekt mij aan."
        </p>
      </div>
    </div>
  ),

  // 5 — Over jezelf
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">👤</span>
          <h2 className="text-[16px] font-bold text-gray-900">3. Over jezelf</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Vertel wie je bent en wat je goed kunt. Leg ook uit waarom jij bij het bedrijf past.
      </p>
      <div className="flex gap-2">
        {[
          { icon: '😊', label: 'Wie ben jij?' },
          { icon: '💪', label: 'Wat kun jij?' },
          { icon: '🤝', label: 'Waarom pas jij?' },
        ].map(({ icon, label }) => (
          <div key={label} className="flex-1 bg-gray-50 rounded-xl py-2 px-1 text-center">
            <div className="text-xl mb-1">{icon}</div>
            <div className="text-[10px] font-semibold text-gray-600">{label}</div>
          </div>
        ))}
      </div>
    </div>
  ),

  // 6 — Ervaring
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">💼</span>
          <h2 className="text-[16px] font-bold text-gray-900">4. Ervaring</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Schrijf welke banen of opleidingen je hebt gedaan en wat je hebt geleerd. Kies wat het beste past bij de baan.
      </p>
      <div className="bg-gray-50 rounded-xl px-3 py-2 text-sm text-gray-600">
        <span className="font-semibold text-gray-800">Geen werkervaring?</span> Dat is oké. Schrijf dan wat je kunt in het dagelijks leven, vrijwilligerswerk of andere activiteiten.
      </div>
    </div>
  ),

  // 7 — Waarom jij?
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">⭐</span>
          <h2 className="text-[16px] font-bold text-gray-900">5. Waarom jij?</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Leg uit waarom jij geschikt bent voor de functie. Wat maakt jou bijzonder ten opzichte van anderen?
      </p>
      <div className="bg-gray-50 rounded-xl p-3">
        <div className="text-[11px] font-semibold text-gray-500 mb-1">Voorbeeld ✏️</div>
        <p className="text-sm text-gray-700 italic leading-relaxed">
          "Ik werk graag met mensen en blijf rustig als het druk is. Ook leer ik snel nieuwe dingen. Daarom denk ik dat ik goed in dit team pas."
        </p>
      </div>
    </div>
  ),

  // 8 — Afsluiting
  () => (
    <div className="bg-white rounded-2xl p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-xl">✉️</span>
          <h2 className="text-[16px] font-bold text-gray-900">6. Afsluiting</h2>
        </div>
        <AudioBtn />
      </div>
      <p className="text-sm text-gray-700 leading-relaxed mb-3">
        Zeg dat je graag langs wilt komen voor een gesprek. Sluit af met een groet en je naam.
      </p>
      <div className="space-y-2">
        {[
          { label: 'Formeel',   example: 'Met vriendelijke groet,' },
          { label: 'Normaal',   example: 'Hartelijke groet,' },
          { label: 'Informeel', example: 'Groetjes,' },
        ].map(({ label, example }) => (
          <div key={label} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-gray-500">{label}</span>
            <span className="text-sm font-medium text-gray-800">{example}</span>
          </div>
        ))}
      </div>
    </div>
  ),
];

export default function SollicitatiebriefLes() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const total = STEPS.length;
  const isLast = step === total - 1;

  function goNext() {
    if (isLast) {
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
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">Sollicitatiebrief</h1>
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

import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

// ── Step dots ──────────────────────────────────────────────────────────────
function StepDots({ current, total }) {
  return (
    <div className="flex gap-1.5 items-center justify-center">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-200 ${
            i === current ? 'w-4 h-2 bg-blue-500' : 'w-2 h-2 bg-gray-300'
          }`}
        />
      ))}
    </div>
  );
}

// ── Visuals ────────────────────────────────────────────────────────────────

/** Step 1 – vier menu-kaarten */
function Visual1({ t }) {
  const items = [
    { label: t.home.menu[0].label, bg: 'bg-red-50',     emoji: '📖' },
    { label: t.home.menu[1].label, bg: 'bg-blue-100',   emoji: '▶️' },
    { label: t.home.menu[2].label, bg: 'bg-purple-100', emoji: '🧩' },
    { label: t.home.menu[3].label, bg: 'bg-teal-100',   emoji: '💬' },
  ];
  return (
    <div className="bg-gray-100 rounded-2xl p-3">
      <div className="border-[2.5px] border-red-500 rounded-xl p-2">
        <div className="grid grid-cols-2 gap-2">
          {items.map(({ label, bg, emoji }) => (
            <div key={label} className="bg-white rounded-xl px-2.5 py-2 flex items-center gap-2 shadow-sm">
              <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center text-sm shrink-0`}>
                {emoji}
              </div>
              <span className="text-[10px] font-bold text-gray-700 leading-tight">{label}</span>
            </div>
          ))}
        </div>
      </div>
      <p className="text-[9px] text-red-500 font-semibold text-center mt-1.5">{t.home.help.visualLabels.v1}</p>
    </div>
  );
}

/** Step 2 – voortgang kaart */
function Visual2({ t }) {
  return (
    <div className="bg-gray-100 rounded-2xl p-3">
      <div className="border-[2.5px] border-red-500 rounded-xl overflow-hidden">
        <div className="bg-gradient-to-br from-[#4a7cf6] to-[#1a50db] px-4 py-3 text-white">
          <p className="text-[9px] opacity-75 mb-0.5">{t.home.progressLabel}</p>
          <p className="text-[20px] font-extrabold tracking-tight">{t.home.progressPct(40)}</p>
          <div className="h-1.5 bg-white/30 rounded-full my-1.5 overflow-hidden">
            <div className="h-full bg-white rounded-full w-2/5" />
          </div>
          <p className="text-[9px] opacity-75">{t.home.progressSub(2, 11)}</p>
        </div>
      </div>
      <p className="text-[9px] text-red-500 font-semibold text-center mt-1.5">{t.home.help.visualLabels.v2}</p>
    </div>
  );
}

/** Step 3 – les stap */
function Visual3({ t }) {
  return (
    <div className="bg-gray-100 rounded-2xl p-3 space-y-2">
      {/* Les kaart */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <div className="flex justify-between items-start gap-2 mb-2">
          <p className="text-[10px] font-bold text-gray-800 flex-1">Wat is een CV?</p>
          {/* Rood kader om luister-knop */}
          <div className="border-[2.5px] border-red-500 rounded-full p-0.5">
            <div className="bg-gray-100 rounded-full px-2 py-0.5 text-[9px] text-gray-500 whitespace-nowrap">
              {t.common.listen}
            </div>
          </div>
        </div>
        <p className="text-[9px] text-gray-500 leading-relaxed">
          Een CV is een overzicht van jezelf...
        </p>
      </div>
      <p className="text-[9px] text-red-500 font-semibold">{t.home.help.visualLabels.v3listen}</p>
      {/* Rood kader om volgende-knop */}
      <div className="border-[2.5px] border-red-500 rounded-xl overflow-hidden">
        <div className="bg-blue-600 py-2 text-center text-[10px] font-bold text-white">
          {t.common.next}
        </div>
      </div>
      <p className="text-[9px] text-red-500 font-semibold">{t.home.help.visualLabels.v3next}</p>
    </div>
  );
}

/** Step 4 – quiz oefening */
function Visual4({ t }) {
  return (
    <div className="bg-gray-100 rounded-2xl p-3 space-y-2">
      {/* Vraag */}
      <div className="bg-white rounded-xl p-2.5 shadow-sm">
        <p className="text-[10px] font-bold text-gray-800">Wat is een CV?</p>
      </div>
      {/* Rood kader om antwoord-opties */}
      <div className="border-[2.5px] border-red-500 rounded-xl p-1.5 space-y-1 bg-white/50">
        {['A', 'B', 'C', 'D'].map((opt, i) => (
          <div
            key={opt}
            className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 border ${
              i === 0 ? 'bg-blue-50 border-blue-400' : 'bg-white border-gray-100'
            }`}
          >
            <span className="text-[9px] font-bold text-gray-400 w-3">{opt}</span>
            <div className={`h-1 rounded flex-1 ${i === 0 ? 'bg-blue-300' : 'bg-gray-200'}`} />
          </div>
        ))}
      </div>
      <p className="text-[9px] text-red-500 font-semibold">{t.home.help.visualLabels.v4choose}</p>
      {/* Controleren knop */}
      <div className="border-[2.5px] border-red-500 rounded-xl overflow-hidden">
        <div className="bg-blue-600 py-1.5 text-center text-[10px] font-bold text-white">
          {t.common.check}
        </div>
      </div>
      <p className="text-[9px] text-red-500 font-semibold">{t.home.help.visualLabels.v4check}</p>
    </div>
  );
}

/** Step 5 – hulp nodig kaart */
function Visual5({ t }) {
  return (
    <div className="bg-gray-100 rounded-2xl p-3 space-y-1.5">
      {/* Andere kaarten vaag op de achtergrond */}
      {[0, 1, 2].map((i) => (
        <div key={i} className="bg-white/60 rounded-xl px-3 py-2 flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-gray-200 shrink-0" />
          <div className="h-2 bg-gray-200 rounded flex-1" />
        </div>
      ))}
      {/* Rood kader om hulp-kaart */}
      <div className="border-[2.5px] border-red-500 rounded-xl overflow-hidden mt-1">
        <div className="bg-white px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center text-base shrink-0">
            💬
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-800">{t.home.menu[3].label}</p>
            <p className="text-[9px] text-gray-400">{t.home.menu[3].sub}</p>
          </div>
        </div>
      </div>
      <p className="text-[9px] text-red-500 font-semibold">{t.home.help.visualLabels.v5}</p>
    </div>
  );
}

/** Step 6 – video les */
function Visual6({ t }) {
  return (
    <div className="bg-gray-100 rounded-2xl p-3 space-y-1.5">
      {/* Video kaart met rood kader */}
      <div className="border-[2.5px] border-red-500 rounded-xl overflow-hidden">
        <div className="bg-white px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-base shrink-0">🎤</div>
          <div className="flex-1 min-w-0">
            <div className="h-2 bg-gray-300 rounded w-3/4 mb-1" />
            <div className="h-1.5 bg-gray-200 rounded w-1/3" />
          </div>
          <span className="text-gray-300 text-base">›</span>
        </div>
      </div>
      <p className="text-[9px] text-red-500 font-semibold">{t.home.help.visualLabels.v6}</p>
      {/* Overige kaarten vaag */}
      {[0, 1].map((i) => (
        <div key={i} className="bg-white/60 rounded-xl px-3 py-2.5 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gray-200 shrink-0" />
          <div className="flex-1">
            <div className="h-2 bg-gray-200 rounded w-2/3 mb-1" />
            <div className="h-1.5 bg-gray-100 rounded w-1/4" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Step 7 – AI sollicitatiegesprek */
function Visual7({ t }) {
  return (
    <div className="bg-gray-100 rounded-2xl p-3 space-y-2">
      {/* Intro kaart met Sanne */}
      <div className="bg-white rounded-xl p-3 shadow-sm">
        <p className="text-[10px] font-bold text-gray-900 mb-1.5">Sollicitatiegesprek bij Albert Heijn</p>
        <div className="bg-gray-100 rounded-lg overflow-hidden mb-2 flex items-center justify-center h-14">
          <span className="text-3xl">👩‍💼</span>
        </div>
        {/* Genummerde stappen */}
        <div className="space-y-1">
          {['Klik op Start het gesprek.', 'Sanne begint met praten.', 'Geef antwoord op elke vraag.'].map((s, i) => (
            <div key={i} className="flex items-start gap-1.5">
              <span className="text-[9px] font-bold text-blue-600 shrink-0">{i + 1}.</span>
              <span className="text-[9px] text-gray-600 leading-tight">{s}</span>
            </div>
          ))}
        </div>
      </div>
      {/* Start knop met rood kader */}
      <div className="border-[2.5px] border-red-500 rounded-xl overflow-hidden">
        <div className="bg-blue-700 py-2 flex items-center justify-center gap-1.5">
          <span className="text-white text-sm">🎤</span>
          <span className="text-white text-[11px] font-bold">Start het gesprek</span>
        </div>
      </div>
      <p className="text-[9px] text-red-500 font-semibold">{t.home.help.visualLabels.v7}</p>
    </div>
  );
}

const VISUALS = [Visual1, Visual2, Visual3, Visual4, Visual6, Visual7, Visual5];

// ── Main component ─────────────────────────────────────────────────────────
export default function HelpPopup({ onClose }) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const h = t.home.help;
  const [step, setStep] = useState(0);
  const total = VISUALS.length;
  const isLast = step === total - 1;

  const Visual = VISUALS[step];

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-end z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-t-3xl w-full max-w-[480px] mx-auto sm:rounded-3xl sm:mb-8 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-gray-100">
          <h2 className="text-[16px] font-bold text-gray-900">{h.popupTitle}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border-none cursor-pointer text-sm active:bg-gray-200"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-5 pt-4 pb-2">
          {/* Visual mockup */}
          <Visual t={t} />

          {/* Step title + description */}
          <div className="mt-3 mb-4">
            <p className="text-[15px] font-bold text-gray-900 mb-1">{h.steps[step].title}</p>
            <p className="text-sm text-gray-600 leading-relaxed">{h.steps[step].desc}</p>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between px-5 pb-5 gap-4">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className="w-10 h-10 rounded-full bg-gray-100 border-none flex items-center justify-center text-gray-600 cursor-pointer text-lg disabled:opacity-30 active:bg-gray-200 transition-colors shrink-0"
          >
            ‹
          </button>

          <StepDots current={step} total={total} />

          {isLast ? (
            <button
              onClick={onClose}
              className="bg-blue-600 text-white border-none rounded-xl px-4 py-2 text-sm font-bold cursor-pointer active:bg-blue-800 shrink-0"
            >
              {h.close}
            </button>
          ) : (
            <button
              onClick={() => setStep((s) => Math.min(total - 1, s + 1))}
              className="w-10 h-10 rounded-full bg-gray-100 border-none flex items-center justify-center text-gray-600 cursor-pointer text-lg active:bg-gray-200 transition-colors shrink-0"
            >
              ›
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

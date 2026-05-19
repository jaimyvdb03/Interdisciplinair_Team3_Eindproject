import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CvMockup from '../../components/CvMockup';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';

function AudioBtn({ label }) {
  return (
    <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer whitespace-nowrap shrink-0">
      {label}
    </button>
  );
}

function renderStep(s, tc) {
  if (s.type === 'intro') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{s.icon}</span>
            <h2 className="text-[16px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.body1}</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{s.body2}</p>
        <CvMockup />
      </div>
    );
  }

  if (s.type === 'list') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <h2 className="text-[16px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.body}</p>
        <div className="space-y-2">
          {s.items.map(({ icon, label }) => (
            <div key={label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
              <span className="text-lg">{icon}</span>
              <span className="text-sm text-gray-800">{label}</span>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (s.type === 'mockup') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <h2 className="text-[16px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.body}</p>
        {s.noExpTitle && (
          <div className="bg-gray-50 rounded-xl px-3 py-2 mb-4 text-sm text-gray-600">
            <span className="font-semibold text-gray-800">{s.noExpTitle}</span> {s.noExpText}
          </div>
        )}
        <p className="text-xs text-gray-400 mb-2">{s.mockupLabel}</p>
        <CvMockup highlight={s.highlight} />
      </div>
    );
  }

  if (s.type === 'methods') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{s.icon}</span>
            <h2 className="text-[16px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{s.body}</p>
        {s.methods.map(({ icon, label, steps }) => (
          <div key={label} className="bg-gray-50 rounded-xl p-3 mb-3">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{icon}</span>
              <span className="text-sm font-bold text-gray-800">{label}</span>
            </div>
            <ol className="space-y-1">
              {steps.map((step, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default function CvMakenLes() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const [step, setStep] = useState(0);

  const steps = t.cvLes.steps;
  const total = steps.length;
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
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">{t.cvLes.pageTitle}</h1>
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
          {renderStep(steps[step], t.common)}
          <div className="mt-4">
            <button
              onClick={goNext}
              className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors"
            >
              {isLast ? t.common.practice : t.common.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

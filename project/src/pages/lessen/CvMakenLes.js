import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CvMockup from '../../components/CvMockup';
import AudioBtn from '../../components/AudioBtn';
import PageHeader from '../../components/PageHeader';
import ProgressBar from '../../components/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';

function renderStep(s, tc) {
  if (s.type === 'intro') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{s.icon}</span>
            <h2 className="text-[18px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{s.body1}</p>
        <p className="text-base text-gray-700 leading-relaxed mb-4">{s.body2}</p>
        <CvMockup />
      </div>
    );
  }

  if (s.type === 'list') {
    const items = [];
    for (let i = 0; i < s.items.length; i++) {
      const item = s.items[i];
      items[i] = (
        <div key={item.label} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
          <span className="text-lg">{item.icon}</span>
          <span className="text-base text-gray-800">{item.label}</span>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <h2 className="text-[18px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{s.body}</p>
        <div className="space-y-2">{items}</div>
      </div>
    );
  }

  if (s.type === 'mockup') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">{s.icon}</span>
            <h2 className="text-[18px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{s.body}</p>
        {s.noExpTitle && (
          <div className="bg-gray-50 rounded-xl px-3 py-2 mb-4 text-base text-gray-600">
            <span className="font-semibold text-gray-800">{s.noExpTitle}</span> {s.noExpText}
          </div>
        )}
        <p className="text-sm text-gray-400 mb-2">{s.mockupLabel}</p>
        <CvMockup highlight={s.highlight} />
      </div>
    );
  }

  if (s.type === 'methods') {
    const methodCards = [];
    for (let m = 0; m < s.methods.length; m++) {
      const method = s.methods[m];
      const stepItems = [];
      for (let i = 0; i < method.steps.length; i++) {
        stepItems[i] = (
          <li key={i} className="flex items-start gap-2 text-base text-gray-700">
            <span className="w-5 h-5 rounded-full bg-gray-300 text-white text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
            {method.steps[i]}
          </li>
        );
      }
      methodCards[m] = (
        <div key={method.label} className="bg-gray-50 rounded-xl p-3 mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{method.icon}</span>
            <span className="text-base font-bold text-gray-800">{method.label}</span>
          </div>
          <ol className="space-y-1">{stepItems}</ol>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{s.icon}</span>
            <h2 className="text-[18px] font-bold text-gray-900">{s.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-4">{s.body}</p>
        {methodCards}
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
        <PageHeader title={t.cvLes.pageTitle} onBack={goBack} step={step + 1} total={total} />
        <ProgressBar step={step} total={total} />
        <div className="px-4 sm:px-0">
          {renderStep(steps[step], t.common)}
          <div className="mt-4">
            <button
              onClick={goNext}
              className="block w-full max-w-xs mx-auto bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors"
            >
              {isLast ? t.common.practice : t.common.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

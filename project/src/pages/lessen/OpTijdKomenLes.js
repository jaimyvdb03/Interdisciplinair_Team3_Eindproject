import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioBtn from '../../components/AudioBtn';
import PageHeader from '../../components/PageHeader';
import ProgressBar from '../../components/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';

function renderStep(step, s, tc) {
  if (step === 0) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">⏰</span>
            <h2 className="text-[16px] font-bold text-gray-900">{s.s0.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed">{s.s0.body}</p>
      </div>
    );
  }

  if (step === 1) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">{s.s1.sectionTitle}</h2>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-semibold text-gray-800">{s.s1.subTitle}</h3>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.s1.body1}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{s.s1.body2}</p>
      </div>
    );
  }

  if (step === 2) {
    const items = [];
    for (let i = 0; i < s.s2.items.length; i++) {
      items[i] = (
        <div key={i} className="flex gap-3 bg-gray-50 rounded-xl px-3 py-2">
          <span className="text-sm font-bold text-blue-500 shrink-0">{i + 1}.</span>
          <span className="text-sm text-gray-700">{s.s2.items[i]}</span>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">{s.s2.sectionTitle}</h2>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-semibold text-gray-800">{s.s2.subTitle}</h3>
          <AudioBtn label={tc.listen} />
        </div>
        <div className="space-y-2">{items}</div>
      </div>
    );
  }

  if (step === 3) {
    const items = [];
    for (let i = 0; i < s.s3.items.length; i++) {
      items[i] = (
        <div key={i} className="flex gap-3 bg-gray-50 rounded-xl px-3 py-2">
          <span className="text-sm font-bold text-blue-500 shrink-0">{i + 1}.</span>
          <span className="text-sm text-gray-700">{s.s3.items[i]}</span>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-gray-900">{s.s3.title}</h2>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.s3.intro}</p>
        <div className="space-y-2">{items}</div>
      </div>
    );
  }

  if (step === 4) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <h2 className="text-[15px] font-bold text-gray-900 mb-3">{s.s4.sectionTitle}</h2>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[14px] font-semibold text-gray-800">{s.s4.subTitle}</h3>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.s4.body1}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{s.s4.body2}</p>
      </div>
    );
  }

  if (step === 5) {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[16px] font-bold text-gray-900">{s.s5.title}</h2>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.s5.body1}</p>
        <p className="text-sm text-gray-700 leading-relaxed">{s.s5.body2}</p>
      </div>
    );
  }

  if (step === 6) {
    const items = [];
    for (let i = 0; i < s.s6.items.length; i++) {
      const item = s.s6.items[i];
      items[i] = (
        <div key={item.text} className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2">
          <span className="text-lg">{item.icon}</span>
          <span className="text-sm text-gray-700">{item.text}</span>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📋</span>
            <h2 className="text-[16px] font-bold text-gray-900">{s.s6.title}</h2>
          </div>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.s6.body1}</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">{s.s6.body2}</p>
        <div className="space-y-2">{items}</div>
      </div>
    );
  }

  return null;
}

export default function OpTijdKomenLes() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const tc = t.common;
  const s = t.opTijdKomenLes;
  const [step, setStep] = useState(0);
  const total = 7;

  function goNext() {
    if (step === total - 1) {
      navigate('/oefeningen/op-tijd-komen');
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
        <PageHeader title={s.pageTitle} onBack={goBack} step={step + 1} total={total} />
        <ProgressBar step={step} total={total} />
        <div className="px-4 sm:px-0">
          {renderStep(step, s, tc)}
          <div className="mt-4">
            <button
              onClick={goNext}
              className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors"
            >
              {step === total - 1 ? tc.practice : tc.next}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

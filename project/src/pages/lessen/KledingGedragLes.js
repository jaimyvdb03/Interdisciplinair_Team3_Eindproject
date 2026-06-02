import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AudioBtn from '../../components/AudioBtn';
import PageHeader from '../../components/PageHeader';
import ProgressBar from '../../components/ProgressBar';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';

function renderStep(s, tc, tk) {
  if (s.type === 'intro') {
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h2 className="text-[18px] font-bold text-gray-900">{s.title}</h2>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-3">{s.body1}</p>
        <p className="text-base text-gray-700 leading-relaxed mb-4">{s.body2}</p>
        <div className="flex gap-6 justify-center mt-4">
          <img src="/images/kleding&gedrag/vraag1/office_suit.png" alt={tk.imgAlt.suit} className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/casual.png" alt={tk.imgAlt.casual} className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/sportswear.png" alt={tk.imgAlt.sport} className="w-32 h-32 object-contain rounded-xl border" />
        </div>
      </div>
    );
  }

  if (s.type === 'list' && s.kind === 'clothing') {
    const items = [];
    for (let i = 0; i < s.items.length; i++) {
      const item = s.items[i];
      items[i] = (
        <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
          <span className="text-base text-gray-800">{item.label}</span>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-bold text-gray-900">{s.title}</h2>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-4">{s.body}</p>
        <div className="flex gap-6 justify-center mb-4">
          <img src="/images/kleding&gedrag/vraag1/office_suit.png" alt={tk.imgAlt.suit} className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/casual.png" alt={tk.imgAlt.casual} className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/sportswear.png" alt={tk.imgAlt.sport} className="w-32 h-32 object-contain rounded-xl border" />
        </div>
        <div className="space-y-2">{items}</div>
      </div>
    );
  }

  if (s.type === 'list' && s.kind === 'behavior') {
    const items = [];
    for (let i = 0; i < s.items.length; i++) {
      const item = s.items[i];
      items[i] = (
        <div key={item.label} className="bg-gray-50 rounded-xl px-3 py-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 shrink-0" />
          <span className="text-base text-gray-800">{item.label}</span>
        </div>
      );
    }
    return (
      <div className="bg-white rounded-2xl p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-[18px] font-bold text-gray-900">{s.title}</h2>
          <AudioBtn label={tc.listen} />
        </div>
        <p className="text-base text-gray-700 leading-relaxed mb-4">{s.body}</p>
        <div className="flex gap-6 justify-center mb-4">
          <img src="/images/kleding&gedrag/vraag3/upright.png" alt={tk.imgAlt.upright} className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag3/slouch.png" alt={tk.imgAlt.slouch} className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag3/arms_crossed.png" alt={tk.imgAlt.arms} className="w-32 h-32 object-contain rounded-xl border" />
        </div>
        <div className="space-y-2">{items}</div>
      </div>
    );
  }

  return null;
}

export default function KledingGedragLes() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const tk = t.kledingGedragLes;
  const [step, setStep] = useState(0);

  const steps = [
    { type: 'intro',  title: tk.introTitle,    body1: tk.introBody1,    body2: tk.introBody2 },
    { type: 'list',   kind: 'clothing', title: tk.clothingTitle, body: tk.clothingBody,
      items: [{ label: tk.item1 }, { label: tk.item2 }, { label: tk.item3 }] },
    { type: 'list',   kind: 'behavior', title: tk.behaviorTitle, body: tk.behaviorBody,
      items: [{ label: tk.item4 }, { label: tk.item5 }, { label: tk.item6 }] },
  ];

  const total = steps.length;
  const isLast = step === total - 1;

  function goNext() {
    if (isLast) {
      navigate('/oefeningen/kleding-gedrag');
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
        <PageHeader title={tk.pageTitle} onBack={goBack} step={step + 1} total={total} />
        <ProgressBar step={step} total={total} />
        <div className="px-4 sm:px-0">
          {renderStep(steps[step], t.common, tk)}
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

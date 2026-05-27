import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{s.body2}</p>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Het is belangrijk om kleding te dragen die past bij het bedrijf waar je solliciteert. Denk na over wat voor indruk je wilt maken. Nette kleding laat zien dat je serieus bent. Maar het is ook belangrijk dat je je prettig voelt in wat je draagt. Zorg dat je kleding schoon en gestreken is. Vermijd te opvallende kleuren of drukke prints, tenzij dat past bij het bedrijf.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-4">
          Naast kleding is je houding belangrijk. Zit rechtop, maak oogcontact en glimlach. Dit laat zien dat je geïnteresseerd en gemotiveerd bent. In deze les leer je meer over wat je kunt doen om een goede indruk te maken tijdens een sollicitatiegesprek.
        </p>
        {/* Visuals for intro (optional) */}
        <div className="flex gap-6 justify-center mt-4">
          <img src="/images/kleding&gedrag/vraag1/office_suit.png" alt="Net pak" className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/casual.png" alt="Casual kleding" className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/sportswear.png" alt="Sportkleding" className="w-32 h-32 object-contain rounded-xl border" />
        </div>
      </div>
    );
  }

  if (s.type === 'list' && s.title.toLowerCase().includes('kleding')) {
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
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Kies kleding die past bij het soort bedrijf. Bij een bank of kantoor draag je vaak een net pak of nette blouse. Bij een creatief bedrijf mag het soms wat losser. Vraag eventueel aan iemand die er werkt wat gebruikelijk is. Zorg altijd dat je kleding schoon is en goed past. Te strakke of te losse kleding kan onprofessioneel overkomen.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Accessoires mogen, maar houd het rustig. Te veel sieraden of een pet/hoed kun je beter thuislaten. Draag schoenen die netjes zijn en bij je outfit passen. Denk ook aan je haar: verzorgd haar maakt een goede indruk.
        </p>
        <div className="flex gap-6 justify-center mb-4">
          <img src="/images/kleding&gedrag/vraag1/office_suit.png" alt="Net pak" className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/casual.png" alt="Casual kleding" className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag1/sportswear.png" alt="Sportkleding" className="w-32 h-32 object-contain rounded-xl border" />
        </div>
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

  if (s.type === 'list' && s.title.toLowerCase().includes('gedrag')) {
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
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Je gedrag tijdens een sollicitatiegesprek zegt veel over jou. Kom op tijd, geef een stevige handdruk en kijk de ander aan. Probeer rustig te blijven, ook als je zenuwachtig bent. Luister goed naar de vragen en denk even na voor je antwoordt. Wees eerlijk en positief over jezelf.
        </p>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">
          Let op je houding: rechtop zitten, niet wiebelen of onderuit zakken. Armen over elkaar kan gesloten overkomen, dus houd je handen ontspannen op tafel of in je schoot. Glimlach af en toe, dat maakt je vriendelijk en toegankelijk.
        </p>
        <div className="flex gap-6 justify-center mb-4">
          <img src="/images/kleding&gedrag/vraag3/upright.png" alt="Rechtop houding" className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag3/slouch.png" alt="Onderuit houding" className="w-32 h-32 object-contain rounded-xl border" />
          <img src="/images/kleding&gedrag/vraag3/arms_crossed.png" alt="Armen over elkaar" className="w-32 h-32 object-contain rounded-xl border" />
        </div>
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

  return null;
}

export default function KledingGedragLes() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const [step, setStep] = useState(0);

  // Example lesson steps for clothing and behavior
  const steps = [
    {
      type: 'intro',
      icon: '👔',
      title: t.kledingGedragLes?.introTitle || 'Kleding en Gedrag bij een Sollicitatie',
      body1: t.kledingGedragLes?.introBody1 || 'Bij een sollicitatiegesprek is het belangrijk om goed gekleed te gaan en je bewust te zijn van je houding en gedrag.',
      body2: t.kledingGedragLes?.introBody2 || 'De eerste indruk telt! In deze les leer je waar je op moet letten qua kleding en gedrag tijdens een sollicitatie.',
    },
    {
      type: 'list',
      icon: '🧥',
      title: t.kledingGedragLes?.clothingTitle || 'Kledingadvies',
      body: t.kledingGedragLes?.clothingBody || 'Draag nette, verzorgde kleding die past bij het bedrijf en de functie. Vermijd te opvallende kleuren of accessoires.',
      items: [
        { icon: '👕', label: t.kledingGedragLes?.item1 || 'Schone en gestreken kleding' },
        { icon: '👖', label: t.kledingGedragLes?.item2 || 'Geen sportkleding of slippers' },
        { icon: '🧼', label: t.kledingGedragLes?.item3 || 'Let op persoonlijke hygiëne' },
      ],
    },
    {
      type: 'list',
      icon: '🧍',
      title: t.kledingGedragLes?.behaviorTitle || 'Gedrag en Houding',
      body: t.kledingGedragLes?.behaviorBody || 'Je houding en gedrag zijn minstens zo belangrijk als je kleding. Wees beleefd, maak oogcontact en geef een stevige handdruk.',
      items: [
        { icon: '🙂', label: t.kledingGedragLes?.item4 || 'Vriendelijk en beleefd zijn' },
        { icon: '🤝', label: t.kledingGedragLes?.item5 || 'Stevige handdruk en oogcontact' },
        { icon: '🪑', label: t.kledingGedragLes?.item6 || 'Rechtop zitten en niet wiebelen' },
      ],
    },
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
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button
            onClick={goBack}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
          >
            ‹
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">{t.kledingGedragLes?.pageTitle || 'Kleding & Gedrag'}</h1>
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

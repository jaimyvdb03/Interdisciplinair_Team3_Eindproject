import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';

const getImg = (name) => process.env.PUBLIC_URL + `/images/kleding&gedrag/${name}`;

const EXERCISE_IMAGES = [
  [
    { id: 'A', img: getImg('vraag1/office_suit.png') },
    { id: 'B', img: getImg('vraag1/casual.png') },
    { id: 'C', img: getImg('vraag1/sportswear.png') },
  ],
  [
    { id: 'A', img: getImg('vraag2/interview.png') },
    { id: 'B', img: getImg('vraag2/baan_zoeken.png') },
    { id: 'C', img: getImg('vraag2/werken.png') },
  ],
  [
    { id: 'A', img: getImg('vraag3/slouch.png') },
    { id: 'B', img: getImg('vraag3/arms_crossed.png') },
    { id: 'C', img: getImg('vraag3/upright.png') },
  ],
];

const CORRECT_ANSWERS = [['A', 'B'], ['C'], ['C']];

export default function KledingGedrag() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const tc = t.common;
  const kg = t.kledingGedragOef;

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const current = kg.questions[step];
  const isCorrect = CORRECT_ANSWERS[step].includes(selected);

  const images = EXERCISE_IMAGES[step];
  const optionButtons = [];
  for (let i = 0; i < images.length; i++) {
    const img = images[i];
    optionButtons[i] = (
      <button
        key={img.id}
        onClick={() => setSelected(img.id)}
        className={`flex-1 flex flex-col items-center rounded-2xl p-3 border-2 transition-all cursor-pointer
          ${selected === img.id
            ? 'border-blue-500 bg-blue-50'
            : 'border-transparent bg-white shadow-sm hover:border-gray-200'
          }`}
      >
        <div className="w-full flex flex-col items-center justify-center bg-gray-50 overflow-hidden rounded-xl mb-2 max-w-[140px] max-h-[180px] mx-auto">
          <img
            src={img.img}
            alt={current.options[i].label}
            className="max-w-[120px] max-h-[160px] w-full h-auto object-contain rounded-xl"
          />
        </div>
        <span className="text-xs font-bold text-gray-500 mb-2">{img.id}</span>
        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
          ${selected === img.id ? 'border-blue-500' : 'border-gray-300'}`}>
          {selected === img.id && (
            <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
          )}
        </div>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">
        <PageHeader title={kg.title} onBack={() => navigate('/oefeningen')} />

        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm sm:mx-0">
          <p className="text-[17px] font-bold text-gray-900 leading-snug mb-3">
            {current.question}
          </p>
          <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer">
            {tc.listen}
          </button>
        </div>

        <div className="flex gap-3 px-4 mb-6 sm:px-0">
          {optionButtons}
        </div>

        <div className="flex justify-center items-center min-h-20 mt-4 mb-4">
          <button
            onClick={() => selected && setShowPopup(true)}
            className={`min-w-[220px] max-w-[320px] rounded-2xl py-4 px-10 text-base font-bold text-white border-none transition-colors
              ${selected ? 'bg-blue-600 cursor-pointer active:bg-blue-800' : 'bg-blue-300 cursor-default'}`}
          >
            {tc.check}
          </button>
        </div>
      </div>

      {showPopup && selected && (
        <div className="fixed inset-0 bg-black/40 flex items-end z-50" onClick={() => setShowPopup(false)}>
          <div
            className="bg-white rounded-t-3xl p-5 w-full max-w-[540px] mx-auto sm:rounded-3xl sm:mb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer">
                  {tc.listen}
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 border-none cursor-pointer text-sm active:bg-gray-200"
                >
                  ✕
                </button>
              </div>
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{current.feedback[selected]}</p>
            {step < kg.questions.length - 1 ? (
              <button
                onClick={() => { setShowPopup(false); setSelected(null); setStep(step + 1); }}
                className="block w-full max-w-xs mx-auto bg-blue-600 text-white rounded-2xl py-4 text-base font-bold border-none cursor-pointer active:bg-blue-800"
              >
                {kg.nextQuestion}
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="block w-full max-w-xs mx-auto bg-blue-600 text-white rounded-2xl py-4 text-base font-bold border-none cursor-pointer active:bg-blue-800"
              >
                {tc.backHome}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

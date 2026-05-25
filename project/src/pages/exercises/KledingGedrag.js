
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const getImg = (name) => process.env.PUBLIC_URL + `/images/kleding&gedrag/${name}`;

const EXERCISES = [
  {
    question: 'Welk outfit zou je aan willen doen bij een sollicitatie voor een kantoorbaan?',
    options: [
      { id: 'A', img: getImg('vraag1/office_suit.png'), label: 'Net pak of nette kleding' },
      { id: 'B', img: getImg('vraag1/casual.png'), label: 'Casual kleding' },
      { id: 'C', img: getImg('vraag1/sportswear.png'), label: 'Sportieve kleding' },
    ],
    correct: ['A', 'B'], // Allow both A and B as correct answers
    feedback: {
      A: 'Dit is een goede keuze voor een sollicitatiegesprek. Nette kleding laat zien dat je het gesprek serieus neemt.',
      B: 'Casual kleding is meestal niet netjes genoeg voor een sollicitatiegesprek op kantoor.',
      C: 'Sportieve kleding is niet geschikt voor een sollicitatiegesprek op kantoor.',
    },
    feedback: {
      A: 'Dit is een goede keuze voor een sollicitatiegesprek. Nette kleding laat zien dat je het gesprek serieus neemt. Voor sommige kantoorbanen is een pak gewenst, voor andere is nette kleding voldoende.',
      B: 'Dit kan ook een goede keuze zijn, afhankelijk van het soort kantoor en de functie. Zorg dat je er verzorgd uitziet en informeer eventueel naar de dresscode.',
      C: 'Sportieve kleding is niet geschikt voor een sollicitatiegesprek op kantoor.',
    },
  },
  {
    question: 'Welke van deze opties is NIET deel van het sollicitatieproces?',
    options: [
      { id: 'A', img: getImg('vraag2/interview.png'), label: 'Sollicitatiegesprek' },
      { id: 'B', img: getImg('vraag2/baan_zoeken.png'), label: 'Sollicitatiebrief schrijven' },
      { id: 'C', img: getImg('vraag2/werken.png'), label: 'Werken in een bloemenwinkel' },
    ],
    correct: 'C',
    feedback: {
      A: 'Een sollicitatiegesprek is een belangrijk onderdeel van het sollicitatieproces.',
      B: 'Een sollicitatiebrief schrijven hoort bij het sollicitatieproces.',
      C: 'Werken in een bloemenwinkel is geen onderdeel van het sollicitatieproces.',
    },
  },
  {
    question: 'Wat is een juiste houding tijdens een interview?',
    options: [
      { id: 'A', img: getImg('vraag3/slouch.png'), label: 'Onderuitgezakt zitten' },
      { id: 'B', img: getImg('vraag3/arms_crossed.png'), label: 'Armen over elkaar' },
      { id: 'C', img: getImg('vraag3/upright.png'), label: 'Rechtop zitten, open houding' },
    ],
    correct: 'C',
    feedback: {
      A: 'Onderuitgezakt zitten maakt geen goede indruk tijdens een interview.',
      B: 'Armen over elkaar kan gesloten overkomen.',
      C: 'Rechtop zitten met een open houding is het beste tijdens een interview.',
    },
  },
];

export default function KledingGedrag() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const current = EXERCISES[step];
  // Support both string and array for correct answers
  const isCorrect = Array.isArray(current.correct)
    ? current.correct.includes(selected)
    : selected === current.correct;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button
            onClick={() => navigate('/oefeningen')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
          >
            ‹
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">Oefenen: Kleding en gedrag</h1>
          <button
            onClick={() => navigate('/')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-base text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
          >
            🏠
          </button>
        </div>

        {/* Question card */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm sm:mx-0">
          <p className="text-[17px] font-bold text-gray-900 leading-snug mb-3">
            {current.question}
          </p>
          <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer">
            🔊 Luister
          </button>
        </div>

        {/* Image options */}
        <div className="flex gap-3 px-4 mb-6 sm:px-0">
          {current.options.map((option) => (
            <button
              key={option.id}
              onClick={() => setSelected(option.id)}
              className={`flex-1 flex flex-col items-center rounded-2xl p-3 border-2 transition-all cursor-pointer
                ${selected === option.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                }`}
            >
              <div className="w-full flex flex-col items-center justify-center bg-gray-50 overflow-hidden rounded-xl mb-2" style={{maxWidth: 140, maxHeight: 180, margin: '0 auto'}}>
                <img 
                  src={option.img} 
                  alt={option.label} 
                  style={{ maxWidth: 120, maxHeight: 160, width: '100%', height: 'auto', objectFit: 'contain', borderRadius: 12 }} 
                />
              </div>
              <span className="text-xs font-bold text-gray-500 mb-2">{option.id}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                ${selected === option.id ? 'border-blue-500' : 'border-gray-300'}`}>
                {selected === option.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Controleren */}
        <div style={{ display: 'flex', justifyContent: 'center', minHeight: 80, alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
          <button
            onClick={() => selected && setShowPopup(true)}
            className={`rounded-2xl py-4 px-10 text-base font-bold text-white border-none transition-colors
              ${selected ? 'bg-blue-600 cursor-pointer active:bg-blue-800' : 'bg-blue-300 cursor-default'}`}
            style={{ minWidth: 220, maxWidth: 320 }}
          >
            Controleren
          </button>
        </div>
      </div>

      {/* Feedback popup */}
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
                  🔊 Luister
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
            {step < EXERCISES.length - 1 ? (
              <button
                onClick={() => {
                  setShowPopup(false);
                  setSelected(null);
                  setStep(step + 1);
                }}
                className="block w-full bg-blue-600 text-white rounded-2xl py-4 text-base font-bold border-none cursor-pointer active:bg-blue-800"
              >
                Volgende vraag
              </button>
            ) : (
              <button
                onClick={() => navigate('/')}
                className="block w-full bg-blue-600 text-white rounded-2xl py-4 text-base font-bold border-none cursor-pointer active:bg-blue-800"
              >
                Terug naar home
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

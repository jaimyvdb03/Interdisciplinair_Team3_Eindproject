import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OUTFITS = [
  {
    id: 'A',
    label: 'Overhemd',
    emoji: '👔',
    colors: 'bg-blue-50',
    description: 'Lichtblauw overhemd, nette broek',
  },
  {
    id: 'B',
    label: 'Pak',
    emoji: '🤵',
    colors: 'bg-gray-800',
    description: 'Zwart formeel pak',
    emojiDark: true,
  },
  {
    id: 'C',
    label: 'Trainingspak',
    emoji: '🎽',
    colors: 'bg-gray-100',
    description: 'Casual trainingspak',
  },
];

const FEEDBACK = {
  A: 'Dit is een goede keuze voor een sollicitatiegesprek. Een overhemd ziet er netjes en verzorgd uit en past goed bij de meeste banen. Met een overhemd laat je zien dat je je best doet en het gesprek serieus neemt. Zo maak je een goede eerste indruk.',
  B: 'Dit kan soms te netjes zijn voor het type baan. Een pak is vooral passend bij heel formele functies en kan daardoor overdressed zijn. Voor veel sollicitatiegesprekken is optie A de betere keuze, omdat een overhemd netjes is maar ook beter past bij de meeste functies.',
  C: 'De meeste kantoorbanen zouden deze keuze niet netjes genoeg vinden. Je kan beter voor optie A gaan, omdat dit er verzorgd en netjes uitziet en beter past bij een sollicitatiegesprek. Met nette kleding laat je zien dat je het gesprek serieus neemt. Zo maak je een goede eerste indruk en dat is belangrijk voor je kansen op de baan.',
};

export default function KledingGedrag() {
  const navigate = useNavigate();
  const [selected, setSelected]   = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const isCorrect = selected === 'A';

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
          <h1 className="text-[17px] font-bold text-gray-900">Oefenen: Kleding en gedrag</h1>
        </div>

        {/* Question card */}
        <div className="mx-4 mb-4 bg-white rounded-2xl p-4 shadow-sm sm:mx-0">
          <p className="text-[17px] font-bold text-gray-900 leading-snug mb-3">
            Welk outfit zou je aan willen doen bij een sollicitatie voor een kantoorbaan?
          </p>
          <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer">
            🔊 Luister
          </button>
        </div>

        {/* Character image options */}
        <div className="flex gap-3 px-4 mb-6 sm:px-0">
          {OUTFITS.map((outfit) => (
            <button
              key={outfit.id}
              onClick={() => setSelected(outfit.id)}
              className={`flex-1 flex flex-col items-center rounded-2xl p-3 border-2 transition-all cursor-pointer
                ${selected === outfit.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                }`}
            >
              {/* Character illustration */}
              <div className={`w-full aspect-[3/4] rounded-xl mb-2 flex flex-col items-center justify-center ${outfit.colors}`}>
                <span className="text-5xl">{outfit.emoji}</span>
                <span className={`text-xs mt-1 font-medium text-center px-1 leading-tight ${outfit.emojiDark ? 'text-gray-300' : 'text-gray-500'}`}>
                  {outfit.description}
                </span>
              </div>
              {/* Label + radio */}
              <span className="text-xs font-bold text-gray-500 mb-2">{outfit.id}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors
                ${selected === outfit.id ? 'border-blue-500' : 'border-gray-300'}`}>
                {selected === outfit.id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Controleren */}
        <div className="px-4 sm:px-0">
          <button
            onClick={() => selected && setShowPopup(true)}
            className={`block w-full rounded-2xl py-4 text-base font-bold text-white border-none transition-colors
              ${selected ? 'bg-blue-600 cursor-pointer active:bg-blue-800' : 'bg-blue-300 cursor-default'}`}
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
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{FEEDBACK[selected]}</p>
            <button
              onClick={() => navigate('/')}
              className="block w-full bg-blue-600 text-white rounded-2xl py-4 text-base font-bold border-none cursor-pointer active:bg-blue-800"
            >
              Terug naar home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

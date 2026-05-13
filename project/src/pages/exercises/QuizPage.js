import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Reusable multiple-choice quiz page (text answers).
 *
 * Props:
 *   title       – header title string
 *   backTo      – path for the back button
 *   question    – question string
 *   options     – [{ id: 'A', text: '...' }, ...]
 *   feedback    – { A: 'feedback text', B: '...', ... }
 *   correctId   – id of the correct option
 */
export default function QuizPage({ title, backTo, question, options, feedback, correctId }) {
  const navigate = useNavigate();
  const [selected, setSelected]     = useState(null);
  const [showPopup, setShowPopup]   = useState(false);

  const isCorrect = selected === correctId;

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button
            onClick={() => navigate(backTo)}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
          >
            ‹
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">{title}</h1>
          <button
            onClick={() => navigate('/')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-base text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
          >
            🏠
          </button>
        </div>

        {/* Question card */}
        <div className="mx-4 mb-3 bg-white rounded-2xl p-4 shadow-sm sm:mx-0">
          <div className="flex justify-between items-start gap-3">
            <p className="text-[17px] font-bold text-gray-900 leading-snug flex-1">{question}</p>
            <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 shrink-0 border-none cursor-pointer whitespace-nowrap">
              🔊 Luister
            </button>
          </div>
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-2.5 px-4 sm:px-0">
          {options.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setSelected(opt.id)}
              className={`flex items-start gap-3 rounded-2xl px-4 py-3.5 text-left w-full border-2 transition-all cursor-pointer
                ${selected === opt.id
                  ? 'border-blue-500 bg-blue-50 shadow-sm'
                  : 'border-transparent bg-white shadow-sm hover:border-gray-200'
                }`}
            >
              <span className="font-bold text-gray-400 w-5 shrink-0 mt-px">{opt.id}</span>
              <span className="text-sm text-gray-900 leading-snug">{opt.text}</span>
            </button>
          ))}
        </div>

        {/* Controleren */}
        <div className="px-4 mt-6 sm:px-0">
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
            className="bg-white rounded-t-3xl p-5 w-full max-w-[540px] mx-auto sm:rounded-3xl sm:mb-8 sm:mx-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Popup header */}
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

            {/* Feedback text */}
            <p className="text-sm text-gray-700 leading-relaxed mb-6">{feedback[selected]}</p>

            {/* Terug naar home */}
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

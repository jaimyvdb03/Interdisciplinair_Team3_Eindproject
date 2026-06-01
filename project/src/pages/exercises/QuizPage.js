import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';

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
  const { lang } = useLanguage();
  const tc = translations[lang].common;
  const [selected, setSelected]   = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const isCorrect = selected === correctId;

  const optionButtons = [];
  for (let i = 0; i < options.length; i++) {
    const opt = options[i];
    optionButtons[i] = (
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
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">
        <PageHeader title={title} onBack={() => navigate(backTo)} />

        {/* Question bg-white rounded-2xl p-4 shadow-sm */}
        <div className="mx-4 mb-3 bg-white rounded-2xl p-4 shadow-sm sm:mx-0">
          <div className="flex justify-between items-start gap-3">
            <p className="text-[19px] font-bold text-gray-900 leading-snug flex-1">{question}</p>
            <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-base text-gray-500 shrink-0 border-none cursor-pointer whitespace-nowrap">
              {tc.listen}
            </button>
          </div>
        </div>

        {/* Answer options */}
        <div className="flex flex-col gap-2.5 px-4 sm:px-0">
          {optionButtons}
        </div>

        {/* Check button */}
        <div className="px-4 mt-6 sm:px-0">
          <button
            onClick={() => selected && setShowPopup(true)}
            className={`block w-full max-w-xs mx-auto rounded-2xl py-4 text-base font-bold text-white border-none transition-colors
              ${selected ? 'bg-blue-600 cursor-pointer active:bg-blue-800' : 'bg-blue-300 cursor-default'}`}
          >
            {tc.check}
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
            <div className="flex justify-between items-center mb-4">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center text-lg ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
                {isCorrect ? '✅' : '❌'}
              </div>
              <div className="flex items-center gap-2">
                <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-base text-gray-500 border-none cursor-pointer">
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
            <p className="text-base text-gray-700 leading-relaxed mb-6">{feedback[selected]}</p>
            <button
              onClick={() => navigate('/')}
              className="block w-full max-w-xs mx-auto bg-blue-600 text-white rounded-2xl py-4 text-base font-bold border-none cursor-pointer active:bg-blue-800"
            >
              {tc.backHome}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

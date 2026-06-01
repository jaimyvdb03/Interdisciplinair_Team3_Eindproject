import { useNavigate } from 'react-router-dom';
import LangPicker from './LangPicker';

export default function PageHeader({ title, onBack, step, total, titleClass = '' }) {
  const navigate = useNavigate();
  return (
    <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
      <button
        onClick={onBack}
        className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
      >
        ‹
      </button>
      <h1 className={`text-[19px] font-bold text-gray-900 flex-1 ${titleClass}`}>{title}</h1>
      <LangPicker />
      <button
        onClick={() => navigate('/')}
        className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-base text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
      >
        🏠
      </button>
      {step != null && <span className="text-sm text-gray-400 font-medium shrink-0">{step} / {total}</span>}
    </div>
  );
}

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

const VIDEOS = [
  {
    id: 1,
    youtubeId: '3tUPwKJEKrk',
    icon: '🎤',
    bg: '#dbeafe',
    duration: '5 min',
    titleKey: 'video1Title',
    descKey: 'video1Desc',
  },
];

export default function VideoLessen() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];
  const v = t.videoLessen || translations.nl.videoLessen;

  const [selected, setSelected] = useState(null);

  // ── Player view ─────────────────────────────────────────────────────────
  if (selected) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="w-full pb-10 sm:px-10 sm:pb-16">

          {/* Header */}
          <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
            <button
              onClick={() => setSelected(null)}
              className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
            >
              ‹
            </button>
            <h1 className="text-[17px] font-bold text-gray-900 flex-1 truncate">{v[selected.titleKey]}</h1>
            <button
              onClick={() => navigate('/')}
              className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-base text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
            >
              🏠
            </button>
          </div>

          {/* Video player */}
          <div className="px-4 sm:px-0">
            <div className="bg-black rounded-2xl overflow-hidden shadow-sm">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  className="absolute inset-0 w-full h-full"
                  src={`https://www.youtube.com/embed/${selected.youtubeId}?autoplay=1`}
                  title={v[selected.titleKey]}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Description card */}
            <div className="bg-white rounded-2xl px-4 py-3.5 mt-3 shadow-sm">
              <p className="text-[15px] font-bold text-gray-900 mb-1">{v[selected.titleKey]}</p>
              <p className="text-sm text-gray-500 leading-relaxed">{v[selected.descKey]}</p>
            </div>
          </div>

        </div>
      </div>
    );
  }

  // ── Overview ─────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button
            onClick={() => navigate('/')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
          >
            ‹
          </button>
          <h1 className="text-[17px] font-bold text-gray-900 flex-1">{t.home.menu[1].label}</h1>
          <button
            onClick={() => navigate('/')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-base text-gray-600 cursor-pointer shrink-0 active:bg-gray-300 transition-colors"
          >
            🏠
          </button>
        </div>

        {/* Video list */}
        <div className="flex flex-col gap-2.5 px-4 pb-10 sm:px-0">
          {VIDEOS.map((video) => (
            <button
              key={video.id}
              onClick={() => setSelected(video)}
              className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 text-left w-full border-none shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
            >
              <div
                className="w-[46px] h-[46px] rounded-[13px] flex items-center justify-center text-xl shrink-0"
                style={{ background: video.bg }}
              >
                {video.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[14.5px] font-semibold text-gray-900 leading-tight truncate">
                  {v[video.titleKey]}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">{video.duration}</p>
              </div>
              <span className="text-xl text-gray-300 shrink-0">›</span>
            </button>
          ))}
        </div>

      </div>
    </div>
  );
}

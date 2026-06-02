import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

const VIDEOS = [
  {
    id: 1,
    icon: '🎤',
    youtubeId: '3tUPwKJEKrk',
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

  if (selected) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="w-full pb-10 sm:px-10 sm:pb-16">
          <PageHeader title={v[selected.titleKey]} onBack={() => setSelected(null)} titleClass="truncate" />

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

            <div className="bg-white rounded-2xl px-4 py-3.5 mt-3 shadow-sm">
              <p className="text-[19px] font-bold text-gray-900 mb-1">{v[selected.titleKey]}</p>
              <p className="text-base text-gray-500 leading-relaxed">{v[selected.descKey]}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const videoCards = [];
  for (let i = 0; i < VIDEOS.length; i++) {
    const video = VIDEOS[i];
    videoCards[i] = (
      <button
        key={video.id}
        onClick={() => setSelected(video)}
        className="flex items-center gap-3.5 bg-white rounded-2xl px-3.5 py-3.5 sm:px-5 sm:py-4 text-left w-full border-none shadow-sm cursor-pointer active:scale-[0.98] transition-transform"
      >
        <span className="text-[28px] shrink-0">{video.icon}</span>
        <div className="flex-1 min-w-0">
          <p className="text-[14.5px] font-semibold text-gray-900 leading-tight truncate">
            {v[video.titleKey]}
          </p>
          <p className="text-sm text-gray-400 mt-0.5">{video.duration}</p>
        </div>
        <span className="text-xl text-gray-300 shrink-0">›</span>
      </button>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">
        <PageHeader title={t.home.menu[1].label} onBack={() => navigate('/')} />

        <div className="flex flex-col gap-2.5 px-4 pb-10 sm:px-0">
          {videoCards}
        </div>
      </div>
    </div>
  );
}

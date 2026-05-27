import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { useLanguage } from '../context/LanguageContext';
import { translations } from '../i18n/translations';

export default function Hulp() {
  const navigate = useNavigate();
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full sm:px-10">
        <PageHeader title={t.hulp.pageTitle} onBack={() => navigate('/')} />

        <div className="flex flex-col items-center justify-center gap-3 mt-24 px-4 text-center">
          <span className="text-5xl">🚧</span>
          <p className="text-[17px] font-bold text-gray-800">{t.hulp.comingSoon}</p>
          <p className="text-sm text-gray-400">{t.hulp.comingSoonSub}</p>
        </div>
      </div>
    </div>
  );
}

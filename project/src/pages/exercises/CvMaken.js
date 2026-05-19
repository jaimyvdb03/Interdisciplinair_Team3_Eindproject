import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import QuizPage from './QuizPage';

export default function CvMaken() {
  const { lang } = useLanguage();
  const t = translations[lang].cvOef;

  return (
    <QuizPage
      title={t.title}
      backTo="/oefeningen"
      question={t.question}
      options={t.options}
      feedback={t.feedback}
      correctId={t.correctId}
    />
  );
}

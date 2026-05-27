import { useLanguage } from '../../context/LanguageContext';
import { translations } from '../../i18n/translations';
import QuizPage from './QuizPage';

export default function OpTijdKomen() {
  const { lang } = useLanguage();
  const o = translations[lang].opTijdKomenOef;
  return (
    <QuizPage
      title={o.title}
      backTo="/oefeningen"
      question={o.question}
      options={o.options}
      feedback={o.feedback}
      correctId={o.correctId}
    />
  );
}

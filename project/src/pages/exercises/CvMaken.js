import QuizPage from './QuizPage';

const OPTIONS = [
  { id: 'A', text: 'Een overzicht van jezelf met je werkervaring, opleiding en vaardigheden.' },
  { id: 'B', text: 'Een brief waarin je jezelf voorstelt.' },
  { id: 'C', text: 'Een formulier om een baan aan te vragen.' },
  { id: 'D', text: 'Een test die je moet maken voor een sollicitatie.' },
];

const FEEDBACK = {
  A: 'Dit is het juiste antwoord. Een CV laat in het kort zien wie je bent en wat je hebt gedaan. Werkgevers gebruiken dit om snel te zien of je bij de baan past.',
  B: 'Een brief waarin je jezelf voorstelt is een sollicitatiebrief. Een CV laat in het kort zien wie je bent en wat je hebt gedaan.',
  C: 'Een CV laat een overzicht van jezelf zien. Dit is geen formulier om een baan mee aan te vragen, maar een document waarmee je laat zien wie je bent, wat je hebt gedaan en wat je kunt.',
  D: 'Een CV is geen test voor je sollicitatie, maar een overzicht van jezelf. Het is een document waarmee je laat zien wie je bent, wat je hebt gedaan en wat je kunt. Je gebruikt het om te laten zien waarom je geschikt bent voor een baan.',
};

export default function CvMaken() {
  return (
    <QuizPage
      title="Oefenen: Je CV maken"
      backTo="/oefeningen"
      question="Wat is een CV?"
      options={OPTIONS}
      feedback={FEEDBACK}
      correctId="A"
    />
  );
}

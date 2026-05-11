import QuizPage from './QuizPage';

const OPTIONS = [
  { id: 'A', text: 'Je kijkt of er een baan beschikbaar is.' },
  { id: 'B', text: 'Je probeert nieuwe vrienden te maken.' },
  { id: 'C', text: 'Je legt uit waarom jij geschikt bent voor de baan en waarom je wilt werken bij het bedrijf.' },
  { id: 'D', text: 'Je stuurt je CV hiermee op.' },
];

const FEEDBACK = {
  A: 'Je stuurt een sollicitatiebrief naar een bedrijf waar al een baan beschikbaar is. De sollicitatiebrief is bedoeld om te laten zien dat je interesse hebt. Je stelt jezelf voor en legt uit waarom jij de baan wilt en waarom jij geschikt bent.',
  B: 'Een sollicitatiebrief is bedoeld om te laten zien waarom jij geschikt bent voor de baan en waarom je daar wilt werken, en niet om vrienden te maken.',
  C: 'Dit is het juiste antwoord. In een sollicitatiebrief leg je uit waarom jij geschikt bent voor de baan en waarom je het bedrijf wilt werken.',
  D: 'Je stuurt vaak wel je CV mee met je sollicitatiebrief, maar dat is niet het doel van de brief. Je CV geeft een overzicht van je ervaring en opleiding. In de sollicitatiebrief leg je uit wie je bent, waarom je de baan wilt en waarom je geschikt bent.',
};

export default function Sollicitatiebrief() {
  return (
    <QuizPage
      title="Oefenen: Sollicitatiebrief"
      backTo="/oefeningen"
      question="Wat is het doel van een sollicitatiebrief?"
      options={OPTIONS}
      feedback={FEEDBACK}
      correctId="C"
    />
  );
}

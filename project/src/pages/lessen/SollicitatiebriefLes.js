import { useNavigate } from 'react-router-dom';

function AudioBtn() {
  return (
    <button className="flex items-center gap-1.5 bg-gray-100 rounded-full px-3 py-1.5 text-sm text-gray-500 border-none cursor-pointer whitespace-nowrap shrink-0">
      🔊 Luister
    </button>
  );
}

function SectionHeading({ number, title }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <h2 className="text-[16px] font-bold text-gray-900">
        {number}. {title}
      </h2>
      <AudioBtn />
    </div>
  );
}

function Block({ children }) {
  return <div className="bg-white rounded-2xl p-4 shadow-sm mb-3">{children}</div>;
}

export default function SollicitatiebriefLes() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="w-full pb-10 sm:px-10 sm:pb-16">

        {/* Header */}
        <div className="flex items-center gap-3 px-4 pt-5 pb-3 bg-gray-100 sticky top-0 z-10 sm:px-0 sm:pt-7">
          <button
            onClick={() => navigate('/lessen')}
            className="w-[34px] h-[34px] rounded-full bg-gray-200 border-none flex items-center justify-center text-xl text-gray-800 cursor-pointer shrink-0 active:bg-gray-300 transition-colors leading-none pb-px"
          >
            ‹
          </button>
          <h1 className="text-[17px] font-bold text-gray-900">Sollicitatiebrief</h1>
        </div>

        <div className="px-4 sm:px-0">

          {/* Wat is een sollicitatiebrief */}
          <Block>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-[16px] font-bold text-gray-900">Wat is een sollicitatiebrief?</h2>
              <AudioBtn />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed">
              Een sollicitatiebrief is een brief waarin je jezelf voorstelt aan een werkgever en uitlegt waarom je graag bij het bedrijf wilt werken. Je schrijft wie je bent, waarom je solliciteert, wat je kwaliteiten zijn en waarom jij geschikt bent voor de functie. Werkgevers gebruiken je sollicitatiebrief om een eerste indruk van je te krijgen en te zien of je past bij de baan en het bedrijf. Tegenwoordig stuur je een sollicitatiebrief meestal als e-mail.
            </p>
          </Block>

          {/* Voorbeeld */}
          <Block>
            <div className="flex items-start justify-between gap-3 mb-3">
              <h2 className="text-[16px] font-bold text-gray-900">Sollicitatiebrief voorbeeld</h2>
              <AudioBtn />
            </div>
            <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed space-y-3">
              <p>Beste meneer Jansen,</p>
              <p>
                Ik zag uw vacature voor logistiek medewerker in het magazijn. De baan spreekt mij aan. Daarom stuur ik deze e-mail.
              </p>
              <p>
                Mijn naam is Kevin en ik ben op zoek naar werk. Ik wil graag werken in een magazijn, omdat ik het fijn vind om actief bezig te zijn. Ik werk graag met mijn handen en hou van duidelijk werk. Ook vind ik het belangrijk om netjes en veilig te werken.
              </p>
              <p>
                Ik heb al ervaring in dit werk. Ik heb gewerkt bij een magazijn van een groot bedrijf. Daar heb ik dozen ingepakt, bestellingen klaargezet en vracht geholpen met laden en lossen. Ook heb ik gewerkt met een scanner om producten te controleren. Ik kan goed samenwerken met collega's en volg instructies goed op.
              </p>
              <p>
                Wat mij aanspreekt in uw bedrijf is dat het een georganiseerde en nette werkplek is. Ik wil graag meer leren en mij verder ontwikkelen in dit werk. Ik ben gemotiveerd en kom altijd op tijd.
              </p>
              <p>
                Graag kom ik langs voor een gesprek om mij verder voor te stellen en meer te horen over de functie.
              </p>
              <p>
                Mijn cv zit in de bijlage. Als u nog vragen heeft, kunt u mij altijd mailen of bellen.
              </p>
              <p>
                Met vriendelijke groet,<br />
                <strong>Kevin Bakker</strong>
              </p>
            </div>
          </Block>

          {/* Wat moet op je sollicitatiebrief */}
          <div className="mb-3">
            <h2 className="text-[16px] font-bold text-gray-900">Wat moet op je sollicitatiebrief?</h2>
          </div>

          {/* 1. Begroeting */}
          <Block>
            <SectionHeading number={1} title="Begroeting" />
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Je begint je mail met een groet aan de persoon die hem leest.
            </p>
            <ul className="text-sm text-gray-700 leading-relaxed space-y-1">
              <li>• Als je de naam van de persoon weet, schrijf je: <span className="font-medium">Beste [naam].</span></li>
              <li>• Als de baan formeler is, schrijf je: <span className="font-medium">Geachte mevrouw / meneer [achternaam].</span></li>
              <li>• Als je de naam niet weet, schrijf je: <span className="font-medium">Geachte heer/mevrouw,</span></li>
            </ul>
          </Block>

          {/* 2. Inleiding */}
          <Block>
            <SectionHeading number={2} title="Inleiding" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Na de begroeting schrijf je kort waar je de vacature hebt gezien of hoe je het bedrijf kent. Bijvoorbeeld: je hebt de vacature op een website gezien, of iemand heeft je erop gewezen.
            </p>
          </Block>

          {/* 3. Persoonlijke informatie */}
          <Block>
            <SectionHeading number={3} title="Persoonlijke informatie" />
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Je moet de lezer een beeld geven van wie jij bent. Schrijf wie je bent, wat je goed kunt en wat je leuk vindt om te doen. Denk bijvoorbeeld aan dingen die je goed kunt op je werk of in het dagelijks leven.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Leg ook uit waarom jij bij het bedrijf en het team past. Als de werkgever een goed beeld van jou krijgt, is de kans groter dat je wordt uitgenodigd voor een gesprek.
            </p>
          </Block>

          {/* 4. Ervaring */}
          <Block>
            <SectionHeading number={4} title="Ervaring" />
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Hier laat je zien dat jij de vaardigheden hebt om de taken te kunnen doen. Schrijf welke banen of opleidingen je hebt gedaan en wat je hebt gedaan of geleerd. Kies de informatie die het beste past bij de baan waar je op solliciteert en geef dat meer aandacht in je mail.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Als je nog geen werkervaring of opleiding hebt, kun je vertellen wat je wel kunt, zoals dingen die je goed kunt in het dagelijks leven, vrijwilligerswerk of andere activiteiten.
            </p>
          </Block>

          {/* 5. Waarom ik */}
          <Block>
            <SectionHeading number={5} title="Waarom ik?" />
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Hier leg je uit waarom jij geschikt bent voor de functie en waarom je de baan zou moeten krijgen. Misschien zijn er ook andere mensen die op dezelfde baan solliciteren. Daarom is het belangrijk dat je laat zien wat jou anders of bijzonder maakt.
            </p>
            <p className="text-sm text-gray-600 italic leading-relaxed bg-gray-50 rounded-xl p-3">
              Voorbeeld:<br />
              "Ik werk graag met mensen en blijf rustig als het druk is. Ook leer ik snel nieuwe dingen. In mijn vorige werk heb ik geleerd om goed samen te werken met collega's en klanten vriendelijk te helpen. Daarom denk ik dat ik goed in dit team pas."
            </p>
          </Block>

          {/* 6. Afsluiting */}
          <Block>
            <SectionHeading number={6} title="Afsluiting" />
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Benadruk het doel van je mail, bijvoorbeeld dat je graag wilt uitgenodigd worden voor een gesprek. Zeg duidelijk dat je het leuk zou vinden om langs te komen om meer over jezelf te vertellen.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-2">
              Als je iets hebt toegevoegd, zoals een cv, kun je daarna zeggen dat dit in de bijlage zit.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed">
              Sluit je mail af met een groet. Bijvoorbeeld: <span className="font-medium">Met vriendelijke groet</span> of <span className="font-medium">Hartelijke groet</span>. Als het minder officieel is, kun je ook <span className="font-medium">Groetjes</span> gebruiken.
            </p>
          </Block>

          {/* Oefenen CTA */}
          <button
            onClick={() => navigate('/oefeningen/sollicitatiebrief')}
            className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors"
          >
            Oefenen
          </button>

        </div>
      </div>
    </div>
  );
}

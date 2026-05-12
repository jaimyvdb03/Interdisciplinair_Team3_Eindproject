import { useNavigate } from 'react-router-dom';
import CvMockup from '../../components/CvMockup';

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

export default function CvMakenLes() {
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
          <h1 className="text-[17px] font-bold text-gray-900">Je CV maken</h1>
        </div>

        <div className="px-4 sm:px-0">

          {/* Intro */}
          <Block>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-[16px] font-bold text-gray-900">Wat is een CV?</h2>
              <AudioBtn />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Een cv is een overzicht van jezelf. Je zet daarin wie je bent, welk werk je hebt gedaan, welke opleiding je hebt gevolgd en wat je kunt. Werkgevers gebruiken je cv om te zien of je bij de baan past. Op het plaatje zie je een voorbeeld van een CV.
            </p>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Op het plaatje zie je een voorbeeld van een cv. Je hoeft hier niet aan te houden. Je mag zelf kiezen hoe je cv eruitziet en wat je erop zet.
            </p>
            <CvMockup />
          </Block>

          {/* Wat moet op je CV */}
          <div className="mb-1">
            <h2 className="text-[16px] font-bold text-gray-900 mb-3">Wat moet op je CV?</h2>
          </div>

          {/* 1. Persoonlijke informatie */}
          <Block>
            <SectionHeading number={1} title="Persoonlijke informatie" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Het is belangrijk dat een werkgever weet hoe hij contact met je kan opnemen. Zet daarom je naam op je cv en, als je die hebt, je telefoonnummer, e-mailadres of adres. Zo kan de werkgever je bereiken. Zet er ook een foto bij, zodat de werkgever ziet wie je bent.
            </p>
          </Block>

          {/* 2. Jezelf voorstellen */}
          <Block>
            <SectionHeading number={2} title="Jezelf voorstellen" />
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Het is belangrijk dat een werkgever weet wie je bent. Stel jezelf kort voor en vertel wie je bent en wat je goed in bent. Zo krijgt de werkgever snel een beeld van jou.
            </p>
            <CvMockup highlight="profiel" />
          </Block>

          {/* 3. Werkervaring */}
          <Block>
            <SectionHeading number={3} title="Werkervaring" />
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Het is belangrijk dat een werkgever weet waar je hebt gewerkt en wat je daar hebt geleerd. Schrijf per baan op wanneer je daar hebt gewerkt en wat je daar hebt gedaan. Als je nog geen werkervaring hebt, kun je school, stages of vrijwilligerswerk opschrijven. Je mag dit onderdeel ook leeg laten als je niets hebt.
            </p>
            <CvMockup highlight="werkervaring" />
          </Block>

          {/* 4. Opleiding */}
          <Block>
            <SectionHeading number={4} title="Opleiding" />
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Het is belangrijk dat een werkgever weet waar je op school hebt gezeten of welke studie je hebt gedaan. Schrijf op wanneer je op school hebt gezeten en daar was. Zo ziet de werkgever wat je al hebt geleerd en wat je kunt.
            </p>
            <CvMockup highlight="opleiding" />
          </Block>

          {/* 5. Extra */}
          <Block>
            <SectionHeading number={5} title="Extra" />
            <p className="text-sm text-gray-700 leading-relaxed">
              Je kunt ook andere dingen op je cv zetten. Denk aan welke talen je spreekt, welke vaardigheden je hebt of wat je leuk vindt om te doen. Hierdoor krijgt de werkgever een beter beeld van jou.
            </p>
          </Block>

          {/* Hoe maak je een CV */}
          <Block>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h2 className="text-[16px] font-bold text-gray-900">Hoe maak je een CV?</h2>
              <AudioBtn />
            </div>
            <p className="text-sm text-gray-700 leading-relaxed mb-3">
              Er is geen standaard voor hoe een CV er uit moet zien. Je kunt een cv op verschillende manieren maken:
            </p>

            <p className="text-sm font-bold text-gray-800 mb-1">• Op papier</p>
            <ol className="text-sm text-gray-700 leading-relaxed pl-4 mb-3 list-decimal">
              <li>Pak papier en een pen</li>
              <li>Schrijf je naam en contactgegevens op</li>
              <li>Schrijf daarna je werk, school en wat je kunt</li>
              <li>Maak het netjes en duidelijk</li>
            </ol>

            <p className="text-sm font-bold text-gray-800 mb-1">• Op de computer</p>
            <ol className="text-sm text-gray-700 leading-relaxed pl-4 mb-3 list-decimal">
              <li>Open Word of Google Docs</li>
              <li>Kies een leeg document of een cv-template</li>
              <li>Typ je naam en contactgegevens</li>
              <li>Typ je werkervaring, opleiding en vaardigheden</li>
              <li>Sla het op en print het uit of stuur het digitaal</li>
            </ol>

            <p className="text-sm font-bold text-gray-800 mb-1">• Online</p>
            <ol className="text-sm text-gray-700 leading-relaxed pl-4 list-decimal">
              <li>Ga naar een cv-website (of gebruik onze bot)</li>
              <li>Kies een cv-template</li>
              <li>Vul je gegevens in (naam, werk, school, etc.)</li>
              <li>De website maakt automatisch je cv</li>
              <li>Download of print je cv</li>
            </ol>
          </Block>

          {/* Oefenen CTA */}
          <button
            onClick={() => navigate('/oefeningen/cv-maken')}
            className="block w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white border-none rounded-2xl py-4 text-base font-bold cursor-pointer transition-colors"
          >
            Oefenen
          </button>

        </div>
      </div>
    </div>
  );
}

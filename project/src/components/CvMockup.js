/** Scaled-down visual CV card matching the Figma design */
export default function CvMockup({ highlight }) {
  const hl = (section) =>
    highlight === section ? 'bg-yellow-100 rounded' : '';

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 text-[7px] leading-tight select-none">
      {/* Header bar */}
      <div className="bg-gray-700 text-white px-3 py-2 flex gap-2 items-center">
        <div className="w-8 h-8 rounded-full bg-gray-400 shrink-0 overflow-hidden flex items-center justify-center text-lg">
          👤
        </div>
        <div>
          <p className="font-bold text-[9px]">Illias Thijssen</p>
          <p className="opacity-70 text-[7px]">Functietitel</p>
          <p className="opacity-60 text-[6px] mt-0.5">📧 illias@email.nl  📞 06-12345678</p>
        </div>
      </div>

      <div className="flex">
        {/* Left column */}
        <div className="w-2/5 bg-gray-50 p-2 flex flex-col gap-1.5">
          <div>
            <p className="font-bold text-[7px] uppercase tracking-wide text-gray-500 mb-0.5">Talen</p>
            <p className="text-gray-600">Nederlands</p>
            <p className="text-gray-600">Engels</p>
          </div>
          <div>
            <p className="font-bold text-[7px] uppercase tracking-wide text-gray-500 mb-0.5">Vaardigheden</p>
            <p className="text-gray-600">• Teamwerk</p>
            <p className="text-gray-600">• Plannen</p>
            <p className="text-gray-600">• Communicatie</p>
          </div>
          <div>
            <p className="font-bold text-[7px] uppercase tracking-wide text-gray-500 mb-0.5">Hobby's</p>
            <p className="text-gray-600">• Sporten</p>
            <p className="text-gray-600">• Lezen</p>
          </div>
        </div>

        {/* Right column */}
        <div className="flex-1 p-2 flex flex-col gap-1.5">
          <div className={hl('profiel')}>
            <p className="font-bold text-[7px] uppercase tracking-wide text-gray-500 mb-0.5">Persoonlijk profiel</p>
            <p className="text-gray-600">Hardwerkend en gemotiveerd. Ik ben op zoek naar een functie waarbij ik mezelf kan ontwikkelen.</p>
          </div>
          <div className={hl('werkervaring')}>
            <p className="font-bold text-[7px] uppercase tracking-wide text-gray-500 mb-0.5">Werkervaring</p>
            <p className="font-semibold text-gray-700">Functietitel, bedrijfsnaam</p>
            <p className="text-gray-500">Begindatum – Einddatum</p>
            <p className="text-gray-600">• Taak 1</p>
            <p className="text-gray-600">• Taak 2</p>
          </div>
          <div className={hl('opleiding')}>
            <p className="font-bold text-[7px] uppercase tracking-wide text-gray-500 mb-0.5">Opleidingen</p>
            <p className="font-semibold text-gray-700">Gevolgde studie, opleidingsinstituut, plaats</p>
            <p className="text-gray-500">Begindatum – eindatum</p>
          </div>
        </div>
      </div>
    </div>
  );
}

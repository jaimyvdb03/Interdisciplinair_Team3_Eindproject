
function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-8 px-2">
      {/* Language selector */}
      <div className="flex justify-end w-full max-w-md mb-2">
        <button className="flex items-center gap-2 bg-white border border-gray-200 rounded-full px-3 py-1 shadow-sm text-sm font-medium">
          <span role="img" aria-label="Dutch flag">🇳🇱</span>
          NL
        </button>
      </div>
      {/* Header */}
      <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2 mb-1">Welkom terug! <span role="img" aria-label="wave">👋</span></h1>
      <p className="text-gray-500 mb-6">Klaar om verder te leren?</p>
      {/* Main buttons */}
      <div className="flex flex-col gap-4 w-full max-w-md">
        {/* Lessen */}
        <button className="flex items-center gap-4 bg-white rounded-xl shadow p-4 hover:bg-blue-50 transition">
          <div className="bg-blue-600 text-white rounded-lg p-3">
            {/* Book icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6l4 2" /></svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-lg text-gray-900">Lessen</span>
            <span className="text-gray-500 text-sm flex items-center gap-2">Lees en luister <span className="ml-2">📝</span> <span>🔊</span></span>
          </div>
        </button>
        {/* Video lessen */}
        <button className="flex items-center gap-4 bg-white rounded-xl shadow p-4 hover:bg-blue-50 transition">
          <div className="bg-blue-600 text-white rounded-lg p-3">
            {/* Video icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M4 6h16M4 18h16M4 6v12" /></svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-lg text-gray-900">Video lessen</span>
            <span className="text-gray-500 text-sm flex items-center gap-2">Kijk en leer <span className="ml-2">🎥</span></span>
          </div>
        </button>
        {/* Oefenen */}
        <button className="flex items-center gap-4 bg-white rounded-xl shadow p-4 hover:bg-blue-50 transition">
          <div className="bg-blue-600 text-white rounded-lg p-3">
            {/* Practice icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" /></svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-lg text-gray-900">Oefenen</span>
            <span className="text-gray-500 text-sm">Probeer het zelf</span>
          </div>
        </button>
        {/* Hulp nodig? */}
        <button className="flex items-center gap-4 bg-white rounded-xl shadow p-4 hover:bg-blue-50 transition">
          <div className="bg-blue-100 text-blue-600 rounded-lg p-3">
            {/* Help icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 14v.01M16 10h.01M12 18a6 6 0 100-12 6 6 0 000 12z" /></svg>
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-lg text-gray-900">Hulp nodig?</span>
            <span className="text-gray-500 text-sm">Stel je vraag</span>
          </div>
        </button>
      </div>
    </div>
  );
}

export default App;

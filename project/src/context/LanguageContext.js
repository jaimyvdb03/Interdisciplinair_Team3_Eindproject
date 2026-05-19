import { createContext, useContext, useState } from 'react';

// Default value means components work even without a LanguageProvider (e.g. in tests)
const LanguageContext = createContext({ lang: 'nl', setLang: () => {} });

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('nl');
  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

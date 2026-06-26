import React, { createContext, useContext, useEffect, useState } from 'react';
import fr from './fr.json';
import ar from './ar.json';

const dictionaries = { fr, ar };
const I18nContext = createContext(null);

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'fr');

  useEffect(() => {
    localStorage.setItem('lang', lang);
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }, [lang]);

  const t = (key) => dictionaries[lang][key] || key;

  const toggleLang = () => setLang((prev) => (prev === 'fr' ? 'ar' : 'fr'));

  return <I18nContext.Provider value={{ lang, setLang, toggleLang, t }}>{children}</I18nContext.Provider>;
}

export const useI18n = () => useContext(I18nContext);

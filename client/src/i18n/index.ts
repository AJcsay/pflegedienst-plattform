import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import de from "./locales/de.json";
import en from "./locales/en.json";

// TODO: AR (RTL), ES — gleiche Struktur, ar.json + es.json ergänzen
// Für AR muss zusätzlich `document.dir = 'rtl'` beim Sprachwechsel gesetzt werden.

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      de: { translation: de },
      en: { translation: en },
    },
    // Standard-Sprache: Deutsch
    lng: undefined, // überlassen dem LanguageDetector
    fallbackLng: "de",
    supportedLngs: ["de", "en"],
    // Browser-Erkennung: localStorage → navigator.language → "de"
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "curamain_lang",
    },
    interpolation: {
      escapeValue: false, // React macht das selbst
    },
    returnNull: false,
  });

// html[lang] beim Start setzen
document.documentElement.lang = i18n.language.startsWith("en") ? "en" : "de";

// html[lang] bei jedem Sprachwechsel aktualisieren
i18n.on("languageChanged", (lng) => {
  document.documentElement.lang = lng.startsWith("en") ? "en" : "de";
});

export default i18n;

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// Language detection function (offline-first)
const detectLanguage = () => {
  const saved = localStorage.getItem("lang");
  if (saved) return saved;

  const browserLang = navigator.language?.slice(0, 2);

  if (["en", "kr"].includes(browserLang)) {
    return browserLang;
  }

  return "kr"; // Default to Krio for Sierra Leone
};

// Import translations
import enTranslations from "./locales/en.json";
import krTranslations from "./locales/kr.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enTranslations,
      },
      kr: {
        translation: krTranslations,
      },
    },
    lng: detectLanguage(),
    fallbackLng: "kr",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
  });

export default i18n;


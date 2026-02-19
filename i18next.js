import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

i18n.use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: "en",
        debug: false,
        ns: ["login", "register"],
        preload: ["en", "fr"],
        interpolation: {
            escapeValue: false, // React already does escaping
        },
        backend: {
            loadPath: "/locales/{{lng}}/{{ns}}.json",
        },
        react: { useSuspense: false }, // Disable suspense for SSR compatibility
    });

export default i18n;

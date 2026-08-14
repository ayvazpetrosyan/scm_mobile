import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import hy from "./locales/hy.json";
import ru from "./locales/ru.json";
import { getStorage } from "@/app/services/storage/storage";

const resources = {
    en: {
        translation: en,
    },
    hy: {
        translation: hy,
    },
    ru: {
        translation: ru,
    },
};

const supportedLanguages = Object.keys(resources);

const initI18n = async () => {
    const storedLanguage = await getStorage("language");
    const initialLanguage =
        storedLanguage && supportedLanguages.includes(storedLanguage)
            ? storedLanguage
            : "hy";

    await i18n.use(initReactI18next).init({
        compatibilityJSON: "v4",
        lng: initialLanguage,
        fallbackLng: "en",
        resources,
        interpolation: {
            escapeValue: false,
        },
    });
};

void initI18n();

export default i18n;

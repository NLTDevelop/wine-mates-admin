import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import { uk } from "./dictionaries/uk";


export const useInitTranslations = () => {
  i18n.use(initReactI18next).init({
    resources: { uk },
    lng: "uk",
    fallbackLng: "uk",
    interpolation: {
      escapeValue: false,
    },
  });
};

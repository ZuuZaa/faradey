import i18n from "i18next"
import { initReactI18next } from "react-i18next";
import Backend from 'i18next-http-backend'


i18n
  .use(Backend) // use backend plugin to load translations
  .use(initReactI18next) // pass i18n instance to react-i18next.
  .init({
    fallbackLng: 'EN',
    lng: 'EN', // if you're using a language detector, remove this line
    backend: {
      // path where resources get loaded from, relative to your entry file
      loadPath: `/locales/{{lng}}/translation.json`
    },
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
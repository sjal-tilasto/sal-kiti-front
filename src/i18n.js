import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

import { languages } from "./locales/index.js";
const messages = Object.assign(languages);

export default new VueI18n({
  locale: navigator.language.split("-")[0],
  fallbackLocale: process.env.VUE_APP_I18N_FALLBACK_LOCALE || "en",
  messages: messages
});

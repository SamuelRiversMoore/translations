import Translations from "./components/Translations.vue";
import TranslationsIndex from "./components/TranslationsIndex.vue";

window.panel.plugin("samrm/translations", {
  sections: {
    translations: Translations,
    translationsindex: TranslationsIndex,
  },
});

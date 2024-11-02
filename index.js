(function() {
  "use strict";
  function normalizeComponent(scriptExports, render, staticRenderFns, functionalTemplate, injectStyles, scopeId, moduleIdentifier, shadowMode) {
    var options = typeof scriptExports === "function" ? scriptExports.options : scriptExports;
    if (render) {
      options.render = render;
      options.staticRenderFns = staticRenderFns;
      options._compiled = true;
    }
    return {
      exports: scriptExports,
      options
    };
  }
  const _sfc_main$3 = {
    data() {
      return {
        isLoading: true,
        headline: "Translations",
        translations: null,
        states: ["false", "pending", "true"],
        icons: { true: "check", pending: "clock", false: "cancel" }
      };
    },
    computed: {
      currentLanguage() {
        return this.$language;
      },
      languages() {
        return this.$languages;
      },
      current() {
        return this.$store.state.content.current;
      },
      model() {
        return this.$store.getters["content/model"](this.current);
      },
      pageId() {
        return this.current.substring(7, this.current.length).replaceAll("+", "/").replace(/(\?.*)/, "");
      }
    },
    methods: {
      getTranslationsStatus() {
        this.load().then((response) => {
          this.headline = response.headline;
          this.translations = response.translations;
          this.isLoading = false;
        }).catch((error) => {
          console.log(error);
        });
      },
      setLanguage(language) {
        this.$emit("change", language);
        this.$go(window.location, {
          query: {
            language: language.code
          }
        });
      },
      setTranslationStatus(languageCode, currentStatus) {
        let currentStatusIndex = this.states.indexOf(currentStatus);
        let newStatus = currentStatusIndex + 1 == this.states.length ? this.states[0] : this.states[currentStatusIndex + 1];
        this.$api.post("set-translation-status", { languageCode, status: newStatus, pageId: this.pageId }).then((response) => {
          this.$set(this.translations, languageCode, response.value);
          if (languageCode === this.currentLanguage.code) {
            this.updateModelField("translated", response.value.toString());
          }
        }).catch(function(error) {
          console.log(error);
        });
      },
      updateModelField(key, value) {
        let content = JSON.parse(JSON.stringify(this.model.originals));
        content[key] = value;
      }
    },
    created() {
      this.getTranslationsStatus();
      this.$events.$on("model.update", this.getTranslationsStatus);
    },
    destroyed() {
      this.$events.$off("model.update", this.getTranslationsStatus);
    }
  };
  var _sfc_render$3 = function render() {
    var _vm = this, _c = _vm._self._c;
    return !_vm.isLoading ? _c("section", { staticClass: "k-modified-section" }, [_c("header", { staticClass: "k-section-header" }, [_c("k-headline", [_vm._v(_vm._s(_vm.headline))])], 1), _c("div", { staticClass: "translations-status" }, [_vm._l(_vm.languages, function(language) {
      return [_c("div", { staticClass: "translation-status", class: { active: language.code === _vm.currentLanguage.code } }, [_vm.translations ? _c("button", { staticClass: "translation-state", on: { "click": function($event) {
        return _vm.setTranslationStatus(language.code, _vm.translations[language.code]);
      } } }, [_c("k-icon", { class: "translated-" + _vm.translations[language.code], attrs: { "type": _vm.icons[_vm.translations[language.code]] } })], 1) : _vm._e(), _c("button", { staticClass: "translation-link", on: { "click": function($event) {
        return _vm.setLanguage(language);
      } } }, [_vm._v(_vm._s(language.name))])])];
    })], 2)]) : _vm._e();
  };
  var _sfc_staticRenderFns$3 = [];
  _sfc_render$3._withStripped = true;
  var __component__$3 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$3,
    _sfc_render$3,
    _sfc_staticRenderFns$3
  );
  __component__$3.options.__file = "/Users/samuel/Projects/w2eu.info/www/site/plugins/translations/src/components/Translations.vue";
  const Translations = __component__$3.exports;
  const _sfc_main$2 = {
    computed: {
      languages() {
        return this.$languages;
      }
    }
  };
  var _sfc_render$2 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("header", { staticClass: "k-translations-index-header flex grow" }, [_c("span", { staticClass: "k-translations-index-header-item k-translations-index-header-title" }, [_vm._v(_vm._s(_vm.$t("pages")))]), _c("span", { staticClass: "flex" }, [_vm._l(_vm.languages, function(language) {
      return [_c("span", { staticClass: "translation-index-state k-translations-index-header-item" }, [_vm._v(" " + _vm._s(language.code) + " ")])];
    })], 2)]);
  };
  var _sfc_staticRenderFns$2 = [];
  _sfc_render$2._withStripped = true;
  var __component__$2 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$2,
    _sfc_render$2,
    _sfc_staticRenderFns$2
  );
  __component__$2.options.__file = "/Users/samuel/Projects/w2eu.info/www/site/plugins/translations/src/components/TranslationsIndexHeader.vue";
  const TranslationsIndexHeader = __component__$2.exports;
  const _sfc_main$1 = {
    data() {
      return {
        icons: { true: "check", pending: "clock", false: "cancel" }
      };
    },
    props: {
      item: {
        required: true
      }
    }
  };
  var _sfc_render$1 = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("div", { staticClass: "k-item k-list-item", attrs: { "data-layout": "list", "data-has-image": "true" } }, [_c("k-item-image", { attrs: { "image": _vm.item.image } }), _c("div", { staticClass: "k-item-content" }, [_c("h3", { staticClass: "k-item-title", attrs: { "title": "Algeria" } }, [_c("k-link", { key: _vm.item.panelUrl, staticClass: "k-item-title-link", attrs: { "to": _vm.item.panelUrl } }, [_vm.item.breadcrumbs ? _c("span", { staticClass: "translation-breadcrumbs", domProps: { "innerHTML": _vm._s(_vm.item.breadcrumbs + "&ensp;>&ensp;") } }) : _vm._e(), _c("span", [_vm._v(_vm._s(_vm.item.title))])])], 1)]), _c("div", { staticClass: "k-item-options flex" }, [_vm._l(_vm.$languages, function(language) {
      return [_vm.item.translations ? _c("span", { staticClass: "translation-index-state" }, [_c("k-icon", { class: "translated-" + _vm.item.translations[language.code], attrs: { "type": _vm.icons[_vm.item.translations[language.code]] } })], 1) : _vm._e()];
    })], 2)], 1);
  };
  var _sfc_staticRenderFns$1 = [];
  _sfc_render$1._withStripped = true;
  var __component__$1 = /* @__PURE__ */ normalizeComponent(
    _sfc_main$1,
    _sfc_render$1,
    _sfc_staticRenderFns$1
  );
  __component__$1.options.__file = "/Users/samuel/Projects/w2eu.info/www/site/plugins/translations/src/components/TranslationsIndexItem.vue";
  const TranslationsIndexItem = __component__$1.exports;
  const _sfc_main = {
    components: {
      TranslationsIndexHeader,
      TranslationsIndexItem
    },
    data() {
      return {
        headline: "Translations",
        index: null,
        isLoading: true
      };
    },
    methods: {
      update() {
        this.isLoading = true;
        this.load().then((response) => {
          this.headline = response.headline;
          this.index = response.index;
          this.isLoading = false;
        });
      }
    },
    created() {
      this.update();
      this.$store.subscribeAction((action, state) => {
        if (action.type == "languages/current") {
          this.$nextTick(() => {
            this.update();
          });
        }
      });
    }
  };
  var _sfc_render = function render() {
    var _vm = this, _c = _vm._self._c;
    return _c("section", { staticClass: "k-modified-section" }, [!_vm.isLoading ? [_c("header", { staticClass: "k-section-header" }, [_c("k-headline", [_vm._v(_vm._s(_vm.headline))])], 1), _c("div", { staticClass: "k-collection translations-index" }, [_c("translations-index-header"), _c("div", { staticClass: "k-items k-list-items", attrs: { "data-layout": "list", "data-size": "medium" } }, [_vm._l(_vm.index, function(item) {
      return [_c("translations-index-item", { attrs: { "item": item } })];
    })], 2)], 1)] : [_c("div", { staticClass: "k-translations-index-loading-container" }, [_c("div", { staticClass: "k-translations-index-spinner" }, [_c("k-icon", { staticClass: "icon", attrs: { "type": "loader", "size": "medium" } })], 1), _c("div", { staticClass: "k-translations-index-loading" }, [_vm._v(_vm._s(_vm.$t("loading")))])])]], 2);
  };
  var _sfc_staticRenderFns = [];
  _sfc_render._withStripped = true;
  var __component__ = /* @__PURE__ */ normalizeComponent(
    _sfc_main,
    _sfc_render,
    _sfc_staticRenderFns
  );
  __component__.options.__file = "/Users/samuel/Projects/w2eu.info/www/site/plugins/translations/src/components/TranslationsIndex.vue";
  const TranslationsIndex = __component__.exports;
  window.panel.plugin("samrm/translations", {
    sections: {
      translations: Translations,
      translationsindex: TranslationsIndex
    }
  });
})();

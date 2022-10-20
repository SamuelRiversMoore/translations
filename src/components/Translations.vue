<template>
  <section v-if="!isLoading" class="k-modified-section">
    <header class="k-section-header">
      <k-headline>{{ headline }}</k-headline>
    </header>
    <div class="translations-status">
      <template v-for="language in languages">
        <div class="translation-status" :class="{ active: language.code === currentLanguage.code }">
          <button v-if="translations" class="translation-state" @click="setTranslationStatus(language.code, translations[language.code])">
            <k-icon :class="'translated-' + translations[language.code]" :type="icons[translations[language.code]]" />
          </button>
          <button class="translation-link" @click="setLanguage(language)">{{ language.name }}</button>
        </div>
      </template>
    </div>
  </section>
</template>

<script>
export default {
  data() {
    return {
      isLoading: true,
      headline: 'Translations',
      translations: null,
      states: ['false', 'pending', 'true'],
      icons: { true: 'check', pending: 'clock', false: 'cancel' }
    }
  },
  computed: {
    currentLanguage() {
      return this.$language
    },
    languages() {
      return this.$languages
    },
    current() {
      return this.$store.state.content.current
    },
    model() {
      return this.$store.getters['content/model'](this.current)
    },
    pageId() {
      return this.current
        .substring(7, this.current.length)
        .replaceAll('+', '/')
        .replace(/(\?.*)/, '')
    }
  },
  methods: {
    getTranslationsStatus() {
      this.load()
        .then((response) => {
          this.headline = response.headline
          this.translations = response.translations
          this.isLoading = false
        })
        .catch((error) => {
          console.log(error)
        })
    },
    setLanguage(language) {
      this.$emit('change', language)
      this.$go(window.location, {
        query: {
          language: language.code
        }
      })
    },
    setTranslationStatus(languageCode, currentStatus) {
      let currentStatusIndex = this.states.indexOf(currentStatus)
      let newStatus = currentStatusIndex + 1 == this.states.length ? this.states[0] : this.states[currentStatusIndex + 1]
      this.$api
        .post('set-translation-status', { languageCode, status: newStatus, pageId: this.pageId })
        .then((response) => {
          this.$set(this.translations, languageCode, response.value)
          if (languageCode === this.currentLanguage.code) {
            this.updateModelField('translated', response.value.toString())
          }
        })
        .catch(function(error) {
          console.log(error)
        })
    },
    updateModelField(key, value) {
      let content = JSON.parse(JSON.stringify(this.model.originals))
      content[key] = value
    }
  },
  created() {
    this.getTranslationsStatus()
    this.$events.$on('model.update', this.getTranslationsStatus)
  },
  destroyed() {
    this.$events.$off('model.update', this.getTranslationsStatus)
  }
}
</script>

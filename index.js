panel.plugin('samrm/translations', {
	sections: {
		translations: {
			data() {
				return {
					isLoading: true,
					headline: 'Translations',
					translations: null
				}
			},
			computed: {
				currentLanguage() {
					return this.$store.state.languages.current
				},
				languages() {
					return this.$store.state.languages.all
				},
				current() {
					return this.$store.state.content.current
				},
				model() {
					return this.$store.getters['content/model'](this.current)
				},
				pageId() {
					return this.current.substring(6, this.current.length - 3)
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
					this.$store.dispatch('languages/current', language)
					this.$emit('change', language)
				},
				setTranslationStatus(languageCode, newStatus) {
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
				}
			},
			created() {
				this.getTranslationsStatus()
				this.$events.$on('model.update', this.getTranslationsStatus)
			},
			destroyed() {
				this.$events.$off('model.update', this.getTranslationsStatus)
			},
			template: `
		        <section v-if="!isLoading" class="k-modified-section">
		              <header class="k-section-header">
		            <k-headline>{{ headline }}</k-headline>
		              </header>
		              <div class="translations-status">
		                <template v-for="language in languages">
		                <div class="translation-status" :class="{active: language.code === currentLanguage.code}">
		                  <button v-if="translations" class="translation-state" @click="setTranslationStatus(language.code, !translations[language.code])" >
		                    <template v-if="translations[language.code]">
		                      <k-icon class="translated" type="check" />
		                    </template>
		                    <template v-else>
		                      <k-icon class="untranslated" type="cancel" />
		                    </template>
		                  </button>
		                  <button class="translation-link" @click="setLanguage(language)">{{ language.name }}</button>
		                </div>
		                </template>
		              </div>
		        </section>
		      `
		}
	}
})

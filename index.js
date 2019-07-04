panel.plugin("samuel/translations", {
	sections: {
		translations: {
			data() {
				return {
					isLoading: true,
					headline: "Translations",
					translations: null
				};
			},
			computed: {
				currentLanguage() {
					return this.$store.state.languages.current;
				},
				languages() {
					return this.$store.state.languages.all;
				}
			},
			methods: {
				getTranslationsStatus() {
					new Promise((resolve, reject) => {
						this.load().then(response => {
							this.headline = response.headline;
							this.translations = response.translations;
							this.isLoading = false;
						});
					});
				},
				setLanguage(language) {
					this.$store.dispatch("languages/current", language);
					this.$emit("change", language);
				}
			},
			created() {
				this.getTranslationsStatus();
				this.$events.$on("model.update", this.getTranslationsStatus);
			},
			destroyed() {
				this.$events.$off("model.update", this.getTranslationsStatus);
			},
			template: `
				<section v-if="!isLoading" class="k-modified-section">
	        		<header class="k-section-header">
						<k-headline>{{ headline }}</k-headline>
	        		</header>
	        		<div class="translations-status">
	        			<template v-for="language in languages">
						    <button class="translation-status" @click="setLanguage(language)" :class="{active: language.code == currentLanguage.code}">
						    	<span v-if="translations" class="translation-status-icon">
						    		<template v-if="translations[language.code]">
						    			<k-icon class="translated" type="check" />
						    		</template>
						    		<template v-else>
						    			<k-icon class="untranslated" type="cancel" />
						    		</template>
						    	</span>
						    	<span>{{ language.name }}</span>
						    </button>
	        			</template>
	        		</div>
				</section>
			`
		}
	}
});

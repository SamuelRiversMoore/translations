<template>
  <section class="k-modified-section">
    <template v-if="!isLoading">
      <header class="k-section-header">
        <k-headline>{{ headline }}</k-headline>
      </header>
      <div class="k-collection translations-index">
        <div class="k-items k-list-items">
          <article class="k-translations-index-header k-item k-list-item">
            <span class="k-item-figure"></span>
            <span class="k-item-content"
              ><span class="k-item-title">{{ $t('pages') }}</span></span
            >
            <span class="k-item-options flex">
              <template v-for="language in languages">
                <span class="translation-index-state">
                  {{ language.code }}
                </span>
              </template>
            </span>
          </article>
          <template v-for="item in index">
            <k-item layout="list" :image="item.image">
              <span class="k-item-title">
                <k-link :to="item.panelUrl" class="k-item-title-link" :key="item.panelUrl">
                  <span v-if="item.breadcrumbs" class="translation-breadcrumbs" v-html="item.breadcrumbs + '&ensp;>&ensp;'"></span><span>{{ item.title }}</span>
                </k-link>
              </span>
              <span class="k-item-options flex">
                <template v-for="language in languages">
                  <span v-if="item.translations" class="translation-index-state">
                    <k-icon :class="'translated-' + item.translations[language.code]" :type="icons[item.translations[language.code]]" />
                  </span>
                </template>
              </span>
            </k-item>
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="k-translations-index-loading-container">
        <div class="k-translations-index-spinner"><k-icon type="loader" size="medium" class="icon" /></div>
        <div class="k-translations-index-loading">{{ $t('loading') }}</div>
      </div>
    </template>
  </section>
</template>

<script>
export default {
  data() {
    return {
      headline: 'Translations',
      index: null,
      isLoading: true,
      icons: { true: 'check', pending: 'clock', false: 'cancel' }
    }
  },
  computed: {
    languages() {
      return this.$languages
    }
  },
  methods: {
    update() {
      this.isLoading = true
      this.load().then((response) => {
        this.headline = response.headline
        this.index = response.index
        this.isLoading = false
      })
    }
  },
  created() {
    this.update()
    this.$store.subscribeAction((action, state) => {
      if (action.type == 'languages/current') {
        this.$nextTick(() => {
          this.update()
        })
      }
    })
  }
}
</script>

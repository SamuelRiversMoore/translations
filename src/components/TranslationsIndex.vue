<template>
  <section class="k-modified-section">
    <template v-if="!isLoading">
      <header class="k-section-header">
        <k-headline>{{ headline }}</k-headline>
      </header>
      <div class="k-collection translations-index">
        <translations-index-header />
        <div class="k-items k-list-items" data-layout="list" data-size="medium">
          <template v-for="item in index">
            <translations-index-item :item="item" />
          </template>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="k-translations-index-loading-container">
        <div class="k-translations-index-spinner">
          <k-icon type="loader" size="medium" class="icon" />
        </div>
        <div class="k-translations-index-loading">{{ $t("loading") }}</div>
      </div>
    </template>
  </section>
</template>

<script>
import TranslationsIndexHeader from "./TranslationsIndexHeader.vue";
import TranslationsIndexItem from "./TranslationsIndexItem.vue";
export default {
  components: {
    TranslationsIndexHeader,
    TranslationsIndexItem,
  },
  data() {
    return {
      headline: "Translations",
      index: null,
      isLoading: true,
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
    },
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
  },
};
</script>

<template>
  <header class="k-translations-index-header flex grow">
    <span
      class="k-translations-index-header-item k-translations-index-header-title"
      >{{ $t("pages") }}</span
    >
    <span class="flex">
      <template v-for="language in languages">
        <span class="translation-index-state k-translations-index-header-item">
          {{ language.code }}
        </span>
      </template>
    </span>
  </header>
</template>

<script>
export default {
  computed: {
    languages() {
      return this.$languages;
    },
  },
};
</script>

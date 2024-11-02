<template>
  <div data-layout="list" data-has-image="true" class="k-item k-list-item">
    <k-item-image :image="item.image" />
    <div class="k-item-content">
      <h3 title="Algeria" class="k-item-title">
        <k-link
          :to="item.panelUrl"
          class="k-item-title-link"
          :key="item.panelUrl"
        >
          <span
            v-if="item.breadcrumbs"
            class="translation-breadcrumbs"
            v-html="item.breadcrumbs + '&ensp;>&ensp;'"
          ></span
          ><span>{{ item.title }}</span>
        </k-link>
      </h3>
    </div>
    <div class="k-item-options flex">
      <template v-for="language in $languages">
        <span v-if="item.translations" class="translation-index-state">
          <k-icon
            :class="'translated-' + item.translations[language.code]"
            :type="icons[item.translations[language.code]]"
          />
        </span>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icons: { true: "check", pending: "clock", false: "cancel" },
    };
  },
  props: {
    item: {
      required: true,
    },
  },
};
</script>

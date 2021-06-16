<template>
  <global-search />
</template>

<script>
import GlobalSearch from '@/_components/GlobalSearch.vue';

export default {
  name: 'CardMiscMenuSearch',
  components: {
    GlobalSearch,
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

.global-search :deep(.search-dropdown) {
  border: none;
  padding-left: 20px;

  .search-dropdown-input {
    background-color: transparent;
  }

  &::after {
    right: auto;
    left: 0;
  }
}

.global-search :deep(.card-container .card-content) {
  min-height: auto;
}
</style>

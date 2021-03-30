<template>
  <div class="card-content-info">
    <div class="card-back-content">
      <!-- eslint-disable-next-line vue/no-v-html -->
      <div class="card-back-info" v-html="infoHTML"></div>
    </div>
  </div>
</template>

<script>
import { Remarkable } from 'remarkable';

export default {
  name: 'CardInfo',
  props: {
    info: {
      type: String,
      default: '',
    },
  },
  computed: {
    infoHTML() {
      // TODO: prerender markdown for build
      const md = new Remarkable();
      return md.render(this.info);
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/colors';

:deep(.card-back-info) {
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0;
    margin-bottom: 10px;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>

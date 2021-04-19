<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    max-height
  >
    <speech :speech="data" show-session />
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { memberTitle } from '@/_mixins/titles.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import Speech from '@/_components/Speech.vue';

export default {
  name: 'Govori',
  components: {
    Speech,
  },
  mixins: [common, memberTitle, sessionHeader, sessionOgImage, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    return {
      data: this.$options.contextData.cardData,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$options.contextData.cardData.results.quote_id}?altHeader=true`;
    },
  },
  created() {
    // TODO:
    // this.$options.cardData.template.contextUrl = this.getSessionSpeechLink(
    //   this.data.results
    // );
  },
};
</script>

<style lang="scss" scoped>
:deep(.card-header) {
  display: none;
}

:deep(.card-back-content) {
  margin-top: 20px;
}
</style>

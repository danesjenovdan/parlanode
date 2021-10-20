<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig" max-height>
    <speech
      :quote="quote"
      :speech="quote?.speech"
      :session="quote?.session"
      show-session
    />
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { personTitle } from '@/_mixins/titles.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import Speech from '@/_components/Speech.vue';

export default {
  name: 'CardQuoteSingle',
  components: {
    Speech,
  },
  mixins: [common, personTitle, sessionHeader, sessionOgImage, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      quote: cardData?.data?.results || {},
    };
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

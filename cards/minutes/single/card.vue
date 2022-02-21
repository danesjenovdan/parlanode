<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <minutes-item :agenda-item="agendaItem" :session="session" show-session />
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { personTitle } from '@/_mixins/titles.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
// import { speechSessionTranscriptContextUrl } from '@/_mixins/contextUrls.js';
import MinutesItem from '@/_components/MinutesItem.vue';

export default {
  name: 'CardMinutesSingle',
  components: {
    MinutesItem,
  },
  mixins: [
    common,
    links,
    // speechSessionTranscriptContextUrl,
    personTitle,
    sessionHeader,
    sessionOgImage,
  ],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      agendaItem: cardData?.data?.results || {},
      session: cardData?.data?.session || {},
    };
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

<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    max-height
  >
    <agenda-item
      :agenda="fixedResult"
      :session="session"
      :hide-share-icon="true"
    />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import AgendaItem from '@/_components/AgendaItem.vue';

export default {
  name: 'AgendaItemCard',
  components: {
    AgendaItem,
  },
  mixins: [common],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { session, result } = this.$options.contextData.cardData;
    return {
      session,
      result,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.result.id}?altHeader=true`;
    },
    fixedResult() {
      return {
        ...this.result,
        votings: {
          votes: this.result.votings.map((v) => v.results),
          session: this.session,
        },
      };
    },
  },
};
</script>

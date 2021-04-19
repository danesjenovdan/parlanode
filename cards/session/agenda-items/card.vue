<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    max-height
  >
    <div class="agenda">
      <agenda-item
        v-for="agenda in fixedResults"
        :key="agenda.id"
        :agenda="agenda"
        :session="session"
      />
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import AgendaItem from '@/_components/AgendaItem.vue';

export default {
  name: 'AgendaItems',
  components: {
    AgendaItem,
  },
  mixins: [common],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { session, results } = this.$options.contextData.cardData;
    return {
      session,
      results,
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.session.id}?altHeader=true`;
    },
    fixedResults() {
      return this.results.map((a) => ({
        ...a,
        votings: {
          votes: a.votings.map((v) => v.results),
          session: this.session,
        },
      }));
    },
  },
};
</script>

<style lang="scss"></style>

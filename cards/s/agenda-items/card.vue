<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    class="card-halfling card-seznam-zakonov"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

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
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import AgendaItem from 'components/AgendaItem.vue';

export default {
  name: 'AgendaItems',
  components: {
    AgendaItem,
  },
  mixins: [
    common,
  ],
  data() {
    const { session, results } = this.$options.cardData.data;
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
      return this.results
        .map(a => ({
          ...a,
          votings: {
            votes: a.votings.map(v => v.results),
            session: this.session,
          },
        }));
    },
  },
};
</script>

<style lang="scss">
</style>

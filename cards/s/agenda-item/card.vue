<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
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

    <agenda-item
      :agenda="fixedResult"
      :session="session"
      :hide-share-icon="true"
    />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import AgendaItem from 'components/AgendaItem.vue';

export default {
  name: 'AgendaItemCard',
  components: {
    AgendaItem,
  },
  mixins: [
    common,
  ],
  data() {
    const { session, result } = this.$options.cardData.data;
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
          votes: this.result.votings.map(v => v.results),
          session: this.session,
        },
      };
    },
  },
};
</script>

<style lang="scss">
</style>

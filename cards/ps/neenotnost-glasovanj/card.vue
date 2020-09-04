<template>
  <score-avg-max
    :card-data="$root.$options.cardData"
    :party="$root.$options.cardData.data.organization"
    :results="$root.$options.cardData.data.result"
    :precision="2"
    type="party"
    context="votings"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>
  </score-avg-max>
</template>

<script>
import common from 'mixins/common';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  name: 'NeenotnostGlasovanj',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>

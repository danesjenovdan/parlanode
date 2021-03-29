<template>
  <score-avg-max
    :card-data="$options.cardData"
    :party="$options.cardData.data.organization"
    :results="$options.cardData.data.result"
    :precision="2"
    type="party"
    context="votings"
  >
    <template #info>
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </template>
  </score-avg-max>
</template>

<script>
import common from '@/_mixins/common.js';
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'NeenotnostGlasovanj',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>

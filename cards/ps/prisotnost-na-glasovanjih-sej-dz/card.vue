<template>
  <score-avg-max
    :card-data="$options.cardData"
    :party="$options.cardData.data.organization"
    :results="$options.cardData.data.votes"
    type="party"
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
  name: 'PrisotnostNaGlasovanjihSejDz',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>

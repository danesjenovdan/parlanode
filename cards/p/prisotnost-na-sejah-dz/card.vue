<template>
  <score-avg-max
    :card-data="$options.cardData"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results.sessions"
    type="person"
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
  name: 'PrisotnostNaSejahDz',
  components: {
    ScoreAvgMax,
  },
  mixins: [common],
};
</script>

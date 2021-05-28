<template>
  <score-avg-max
    :party="$options.contextData.cardData.party"
    :results="$options.contextData.cardData.results"
    type="party"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardGroupStPoslanskihVprasanjInPobud',
  components: {
    ScoreAvgMax,
  },
};
</script>

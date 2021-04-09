<template>
  <score-avg-max
    :party="$options.contextData.cardData.organization"
    :results="$options.contextData.cardData.votes"
    type="party"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaGlasovanjihSejDz',
  components: {
    ScoreAvgMax,
  },
};
</script>

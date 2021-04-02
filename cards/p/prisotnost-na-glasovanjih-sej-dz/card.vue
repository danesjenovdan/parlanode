<template>
  <score-avg-max
    :person="$options.contextData.cardData.person"
    :results="$options.contextData.cardData.results.votes"
    type="person"
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

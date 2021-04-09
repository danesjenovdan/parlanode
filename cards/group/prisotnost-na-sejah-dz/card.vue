<template>
  <score-avg-max
    :party="$options.contextData.cardData.organization"
    :results="$options.contextData.cardData.sessions"
    type="party"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'PrisotnostNaSejahDz',
  components: {
    ScoreAvgMax,
  },
};
</script>

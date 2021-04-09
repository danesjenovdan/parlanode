<template>
  <score-avg-max
    :person="$options.contextData.cardData.person"
    :results="$options.contextData.cardData.results.sessions"
    type="person"
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

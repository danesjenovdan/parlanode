<template>
  <score-avg-max
    :party="$options.contextData.cardData.data?.group"
    :results="$options.contextData.cardData.data?.results"
    type="party"
    context="speeches"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'RaznolikostBesedisca',
  components: {
    ScoreAvgMax,
  },
};
</script>

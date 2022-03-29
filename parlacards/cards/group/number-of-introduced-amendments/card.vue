<template>
  <score-avg-max
    :party="$options.contextData.cardData?.data?.group"
    :results="$options.contextData.cardData?.data?.results"
    type="party"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardGroupNumberOfIntroducedAmendments',
  components: {
    ScoreAvgMax,
  },
};
</script>

<template>
  <score-avg-max
    :person="$options.contextData.cardData.data?.person"
    :results="$options.contextData.cardData.data?.results"
    type="person"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardPersonStPoslanskihVprasanjInPobud',
  components: {
    ScoreAvgMax,
  },
};
</script>

<template>
  <score-avg-max
    :party="$options.contextData.cardData?.data?.group"
    :results="$options.contextData.cardData?.data?.results"
    percent
    type="party"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardGroupVoteAttendance',
  components: {
    ScoreAvgMax,
  },
};
</script>

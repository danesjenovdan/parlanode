<template>
  <score-avg-max
    :person="$options.contextData.cardData?.data?.person"
    :results="$options.contextData.cardData?.data?.results"
    percent
    type="person"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardPersonVoteAttendance',
  components: {
    ScoreAvgMax,
  },
};
</script>

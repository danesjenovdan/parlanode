<template>
  <score-avg-max
    :person="$options.contextData.cardData?.data?.person"
    :results="$options.contextData.cardData?.data?.results"
    type="person"
    context="speeches"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardPersonAverageNumberOfSpeechesPerSession',
  components: {
    ScoreAvgMax,
  },
};
</script>

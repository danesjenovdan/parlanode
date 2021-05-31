<template>
  <score-avg-max
    :person="$options.contextData.cardData.data?.person"
    :results="$options.contextData.cardData.data?.results"
    type="person"
    context="votings"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardPersonNeujemanjeSPoslanskoSkupino',
  components: {
    ScoreAvgMax,
  },
};
</script>

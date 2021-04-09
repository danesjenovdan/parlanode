<template>
  <score-avg-max
    :person="$options.contextData.cardData.person"
    :results="$options.contextData.cardData.result"
    type="person"
    context="votings"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'NeujemanjeSPoslanskoSkupino',
  components: {
    ScoreAvgMax,
  },
};
</script>

<template>
  <score-avg-max
    :person="$options.contextData.cardData.person"
    :results="$options.contextData.cardData.results"
    type="person"
    context="speeches"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardPersonSteviloIzgovorjenihBesed',
  components: {
    ScoreAvgMax,
  },
};
</script>

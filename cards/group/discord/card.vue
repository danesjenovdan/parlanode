<template>
  <score-avg-max
    :party="$options.contextData.cardData.organization"
    :results="$options.contextData.cardData.result"
    :precision="2"
    type="party"
    context="votings"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardGroupDiscord',
  components: {
    ScoreAvgMax,
  },
};
</script>

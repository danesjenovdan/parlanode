<template>
  <score-avg-max
    :party="$options.contextData.cardData?.data?.group"
    :results="$options.contextData.cardData?.data?.results"
    type="party"
    :precision="2"
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

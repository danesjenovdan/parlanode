<template>
  <score-avg-max
    :person="$options.contextData.cardData?.data?.person"
    :results="$options.contextData.cardData?.data?.results"
    :precision="2"
    type="person"
    context="speeches"
  />
</template>

<script>
import ScoreAvgMax from '@/_components/ScoreAvgMax.vue';

export default {
  name: 'CardPersonVocabularySize',
  components: {
    ScoreAvgMax,
  },
};
</script>

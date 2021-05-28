<template>
  <style-scores
    :party="$options.contextData.cardData.party"
    :results="$options.contextData.cardData.results"
    type="party"
  />
</template>

<script>
import StyleScores from '@/_components/StyleScores.vue';

export default {
  name: 'CardGroupStilneAnalize',
  components: {
    StyleScores,
  },
};
</script>

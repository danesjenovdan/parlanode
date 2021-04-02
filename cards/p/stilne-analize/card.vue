<template>
  <style-scores
    :person="$options.contextData.cardData.person"
    :results="$options.contextData.cardData.results"
    type="person"
  />
</template>

<script>
import StyleScores from '@/_components/StyleScores.vue';

export default {
  name: 'StilneAnalize',
  components: {
    StyleScores,
  },
};
</script>

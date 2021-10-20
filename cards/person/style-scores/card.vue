<template>
  <style-scores
    :person="$options.contextData.cardData?.data?.person"
    :results="$options.contextData.cardData?.data?.results || {}"
    type="person"
  />
</template>

<script>
import StyleScores from '@/_components/StyleScores.vue';

export default {
  name: 'CardPersonStyleScores',
  components: {
    StyleScores,
  },
};
</script>

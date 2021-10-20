<template>
  <style-scores
    :party="$options.contextData.cardData?.data?.party"
    :results="$options.contextData.cardData?.data?.results || {}"
    type="party"
  />
</template>

<script>
import StyleScores from '@/_components/StyleScores.vue';

export default {
  name: 'CardGroupStyleScores',
  components: {
    StyleScores,
  },
};
</script>

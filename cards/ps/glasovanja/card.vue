<template>
  <glasovanja
    :card-data="$options.cardData"
    type="party"
    :party="$options.cardData.data.party"
  />
</template>

<script>
import Glasovanja from 'components/Glasovanja.vue';

export default {
  name: 'GlasovanjaPoslanskeSkupine',
  components: {
    Glasovanja,
  },
};
</script>

<template>
  <glasovanja
    :card-data="$options.cardData"
    :party="$options.cardData.data.party"
    type="party"
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

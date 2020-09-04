<template>
  <glasovanja
    :card-data="$root.$options.cardData"
    :party="$root.$options.cardData.data.party"
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

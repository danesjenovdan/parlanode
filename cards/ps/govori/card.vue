<template>
  <govori
    :card-data="$options.cardData"
    type="party"
    :party="$options.cardData.data.party"
  />
</template>

<script>
import Govori from 'components/Govori.vue';

export default {
  name: 'GovoriPoslanskeSkupine',
  components: {
    Govori,
  },
};
</script>

<template>
  <poslanska-vprasanja-in-pobude
    :card-data="$options.cardData"
    type="party"
    :party="$options.cardData.data.party"
  />
</template>

<script>
import PoslanskaVprasanjaInPobude from 'components/PoslanskaVprasanjaInPobude.vue';

export default {
  name: 'PoslanskaVprasanjaInPobudePoslanskeSkupine',
  components: { PoslanskaVprasanjaInPobude },
};
</script>

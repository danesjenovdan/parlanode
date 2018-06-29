<template>
  <poslanska-vprasanja-in-pobude
    :card-data="$options.cardData"
    :party="$options.cardData.data.party"
    type="party"
  />
</template>

<script>
import PoslanskaVprasanjaInPobude from 'components/PoslanskaVprasanjaInPobude.vue';

export default {
  name: 'PoslanskaVprasanjaInPobudePoslanskeSkupine',
  components: { PoslanskaVprasanjaInPobude },
};
</script>

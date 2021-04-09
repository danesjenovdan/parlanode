<template>
  <poslanska-vprasanja-in-pobude
    :context-data="$options.contextData"
    type="party"
  />
</template>

<script>
import PoslanskaVprasanjaInPobude from '@/_components/PoslanskaVprasanjaInPobude.vue';

export default {
  name: 'PoslanskaVprasanjaInPobudePoslanskeSkupine',
  components: {
    PoslanskaVprasanjaInPobude,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

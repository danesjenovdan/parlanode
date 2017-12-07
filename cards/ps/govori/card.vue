<template>
  <govori
    :card-data="$options.cardData"
    type="party"
    :party="$options.cardData.data.party"
  ></govori>
</template>

<script>
import Govori from 'components/Govori.vue'

export default {
  components: { Govori },
  name: 'GovoriPoslanskeSkupine',
};
</script>

<style lang="scss" scoped>
</style>

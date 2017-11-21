<template>
  <govori
    :card-data="$options.cardData"
    type="person"
  ></govori>
</template>

<script>
import Govori from 'components/Govori.vue'


export default {
  components: { Govori },
  name: 'GovoriPoslanca',
};
</script>

<style lang="scss" scoped>
    .card-content {
        overflow-y: scroll !important;
    }
</style>

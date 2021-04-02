<template>
  <govori :context-data="$options.contextData" type="person" />
</template>

<script>
import Govori from '@/_components/Govori.vue';

export default {
  name: 'GovoriPoslanca',
  components: {
    Govori,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

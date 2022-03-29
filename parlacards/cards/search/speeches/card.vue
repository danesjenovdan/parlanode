<template>
  <govori type="search" />
</template>

<script>
import Govori from '@/_components/Govori.vue';

export default {
  name: 'CardSearchSpeeches',
  components: {
    Govori,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

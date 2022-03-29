<template>
  <govori type="party" />
</template>

<script>
import Govori from '@/_components/Govori.vue';

export default {
  name: 'CardGroupSpeeches',
  components: {
    Govori,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

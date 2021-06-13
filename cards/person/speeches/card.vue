<template>
  <govori type="person" />
</template>

<script>
import Govori from '@/_components/Govori.vue';

export default {
  name: 'CardPersonSpeeches',
  components: {
    Govori,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

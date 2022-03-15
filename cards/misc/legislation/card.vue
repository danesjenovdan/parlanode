<template>
  <legislation />
</template>

<script>
import Legislation from '@/_components/Legislation.vue';

export default {
  name: 'CardMiscLegislation',
  components: {
    Legislation,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

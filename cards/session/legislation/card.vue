<template>
  <legislation type="session" />
</template>

<script>
import Legislation from '@/_components/Legislation.vue';

export default {
  name: 'CardSessionLegislation',
  components: {
    Legislation,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

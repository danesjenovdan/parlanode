<template>
  <glasovanja type="person" />
</template>

<script>
import Glasovanja from '@/_components/Glasovanja.vue';

export default {
  name: 'CardPersonVotes',
  components: {
    Glasovanja,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

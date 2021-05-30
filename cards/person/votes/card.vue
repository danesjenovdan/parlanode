<template>
  <glasovanja :context-data="$options.contextData" type="person" />
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

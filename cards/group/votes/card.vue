<template>
  <glasovanja :context-data="$options.contextData" type="party" />
</template>

<script>
import Glasovanja from '@/_components/Glasovanja.vue';

export default {
  name: 'CardGroupVotes',
  components: {
    Glasovanja,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

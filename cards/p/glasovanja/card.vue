<template>
  <glasovanja :context-data="$options.contextData" type="person" />
</template>

<script>
import Glasovanja from '@/_components/Glasovanja.vue';

export default {
  name: 'GlasovanjaPoslanca',
  components: {
    Glasovanja,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

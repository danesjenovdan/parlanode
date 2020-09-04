<template>
  <glasovanja
    :card-data="$root.$options.cardData"
    :person="$root.$options.cardData.data.person"
    type="person"
  />
</template>

<script>
import Glasovanja from 'components/Glasovanja.vue';

export default {
  name: 'GlasovanjaPoslanca',
  components: {
    Glasovanja,
  },
};
</script>

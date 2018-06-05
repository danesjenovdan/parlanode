<template>
  <glasovanja
    :card-data="$options.cardData"
    type="person"
    :person="$options.cardData.data.person"
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

<template>
  <glasovanja
    :card-data="$options.cardData"
    :person="$options.cardData.data.person"
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

<template>
  <govori
    :card-data="$options.cardData"
    :person="$options.cardData.data.highlighting[0].person"
    type="person"
  />
</template>

<script>
import Govori from 'components/Govori.vue';

export default {
  name: 'GovoriPoslanca',
  components: {
    Govori,
  },
};
</script>

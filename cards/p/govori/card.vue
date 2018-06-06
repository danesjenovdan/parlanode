<template>
  <govori
    :card-data="$options.cardData"
    type="person"
    :person="$options.cardData.data.highlighting[0].person"
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

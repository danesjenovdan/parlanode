<template>
  <govori :context-data="$options.contextData" type="party" />
</template>

<script>
import Govori from '@/_components/Govori.vue';

export default {
  name: 'CardGroupGovori',
  components: {
    Govori,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

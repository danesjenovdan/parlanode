<template>
  <search-minutes type="search" />
</template>

<script>
import SearchMinutes from '@/_components/SearchMinutes.vue';

export default {
  name: 'CardSearchSpeeches',
  components: {
    SearchMinutes,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

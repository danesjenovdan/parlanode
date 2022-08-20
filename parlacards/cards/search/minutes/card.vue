<template>
  <search-minutes type="search" />
</template>

<script>
import SearchMinutes from '@/_components/SearchMinutes.vue';

export default {
  name: 'CardSearchMinutes',
  components: {
    SearchMinutes,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

<template>
  <govori :card-data="$options.cardData" :party="party" type="party" />
</template>

<script>
import Govori from '@/_components/Govori.vue';

export default {
  name: 'GovoriPoslanskeSkupine',
  components: {
    Govori,
  },
  computed: {
    party() {
      const { data } = this.$options.cardData;
      if (data.party) {
        return data.party;
      }

      const partyId =
        data && data.filters && data.filters.parties && data.filters.parties[0];
      return {
        acronym: '???',
        is_coalition: true,
        id: partyId ? Number(partyId) : 0,
        name: '???',
      };
    },
  },
};
</script>

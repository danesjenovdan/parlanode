<template>
  <govori
    :card-data="$options.cardData"
    :party="party"
    type="party"
  />
</template>

<script>
import Govori from 'components/Govori.vue';

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

      const first = data && data.highlighting && data.highlighting[0];
      if (first && first.person && first.person.party) {
        return first.person.party;
      }

      const facets = data && data.facet_counts && data.facet_counts.facet_fields;
      const parties = facets && facets.party_e;
      const partyId = data && data.filters && data.filters.parties && data.filters.parties[0];
      if (parties && partyId) {
        const party = parties.map(p => p.party).find(p => p.id === Number(partyId));
        if (party) {
          return party;
        }
      }

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

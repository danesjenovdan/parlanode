<template>
  <govori
    :card-data="$options.cardData"
    :party="party"
    type="party"
  />
</template>

<script>
import { get } from 'lodash';
import Govori from 'components/Govori.vue';

export default {
  name: 'GovoriPoslanskeSkupine',
  components: {
    Govori,
  },
  computed: {
    party() {
      let party = get(this.$options.cardData.data, 'highlighting[0].person.party');
      if (party) {
        return party;
      }
      const parties = get(this.$options.cardData.data, 'facet_counts.facet_fields.party_e');
      const partyId = get(this.$options.cardData.data, 'filters.parties[0]');
      if (parties) {
        party = parties.map(p => p.party).find(p => p.id === Number(partyId));
      }
      if (party) {
        return party;
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

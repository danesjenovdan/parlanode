<template>
  <govori
    :card-data="$options.cardData"
    :person="person"
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
  computed: {
    person() {
      const { data } = this.$options.cardData;
      if (data.person) {
        return data.person;
      }

      const first = data && data.highlighting && data.highlighting[0];
      if (first && first.person) {
        return first.person;
      }

      const facets = data && data.facet_counts && data.facet_counts.facet_fields;
      const people = facets && facets.speaker_i;
      const personId = data && data.filters && data.filters.people && data.filters.people[0];
      if (people && personId) {
        const person = people.map(p => p.person).find(p => p.id === Number(personId));
        if (person) {
          return person;
        }
      }

      return {
        name: '???',
        district: null,
        gender: null,
        is_active: null,
        party: {
          acronym: '???',
          is_coalition: true,
          id: 0,
          name: '???',
        },
        type: '???',
        id: personId ? Number(personId) : 0,
        gov_id: 'null',
        has_function: false,
      };
    },
  },
};
</script>

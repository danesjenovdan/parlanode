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
      let person = this.$options.cardData.data
        && this.$options.cardData.data.highlighting
        && this.$options.cardData.data.highlighting[0]
        && this.$options.cardData.data.highlighting[0].person;
      if (person) {
        return person;
      }
      const people = this.$options.cardData.data
        && this.$options.cardData.data.facet_counts
        && this.$options.cardData.data.facet_counts.facet_fields
        && this.$options.cardData.data.facet_counts.facet_fields.speaker_i;
      const personId = this.$options.cardData.data
        && this.$options.cardData.data.filters
        && this.$options.cardData.data.filters.people
        && this.$options.cardData.data.filters.people[0];
      if (people) {
        person = people.map(p => p.party).find(p => p.id === Number(personId));
      }
      if (person) {
        return person;
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
        id: 0,
        gov_id: 'null',
        has_function: false,
      };
    },
  },
};
</script>

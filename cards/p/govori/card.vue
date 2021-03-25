<template>
  <govori :card-data="$options.cardData" :person="person" type="person" />
</template>

<script>
import Govori from '@/_components/Govori.vue';

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

      const personId =
        data && data.filters && data.filters.people && data.filters.people[0];
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

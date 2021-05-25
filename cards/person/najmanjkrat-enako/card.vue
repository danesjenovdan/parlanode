<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <person-list :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { personVotes } from '@/_mixins/contextUrls.js';
import { personTitle } from '@/_mixins/titles.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';
import PersonList from '@/_components/PersonList.vue';

export default {
  name: 'NajmanjkratGlasujejoEnako',
  components: {
    PersonList,
  },
  mixins: [common, personVotes, personHeader, personOgImage, personTitle],
  data() {
    const people = this.$options.contextData.cardData.results.map((o) => {
      const { person } = o;
      person.score = `${(o.ratio || 0).toFixed(2).replace('.', ',')}`;
      return person;
    });
    return {
      people,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$options.contextData.cardData.person.id}?altHeader=true`;
    },
  },
};
</script>

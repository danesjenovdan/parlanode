<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <person-list :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { partyVotes } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import PersonList from '@/_components/PersonList.vue';

export default {
  name: 'CardGroupLeastVotesInCommon',
  components: {
    PersonList,
  },
  mixins: [common, partyVotes, partyTitle, partyHeader, partyOgImage],
  data() {
    const people = this.$options.contextData.cardData.results.map((o) => {
      const { person } = o;
      person.score = `${(o.ratio || 0).toFixed(2).replace('.', ',')}`;
      return person;
    });
    return {
      data: this.$options.contextData.cardData,
      people,
    };
  },
};
</script>

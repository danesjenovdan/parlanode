<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <person-list :people="people" />
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
  name: 'CardGroupDeviationFromGroup',
  components: {
    PersonList,
  },
  mixins: [common, partyVotes, partyHeader, partyOgImage, partyTitle],
  data() {
    const results = (this.cardData.data?.results || [])
      .slice()
      .sort((a, b) => b.value - a.value);
    const people = results.map((o) => {
      const { person } = o;
      person.score = `${(o.value || 0).toFixed(2).replace('.', ',')} %`;
      return person;
    });
    return {
      people,
    };
  },
};
</script>

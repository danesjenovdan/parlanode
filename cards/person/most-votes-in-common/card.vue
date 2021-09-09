<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
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
import numberFormatter from '@/_helpers/numberFormatter.js';

export default {
  name: 'CardPersonMostVotesInCommon',
  components: {
    PersonList,
  },
  mixins: [common, personVotes, personHeader, personOgImage, personTitle],
  data() {
    const results = (this.cardData.data?.results || [])
      .slice()
      .sort((a, b) => a.value - b.value);
    const people = results.map((entry) => ({
      ...entry.person,
      score: numberFormatter(entry.value, { precision: 2 }),
    }));
    return {
      people,
    };
  },
};
</script>

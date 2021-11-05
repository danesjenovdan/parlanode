<template>
  <card-wrapper :header-config="headerConfig">
    <person-list :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { personVotesContextUrl } from '@/_mixins/contextUrls.js';
import { personTitle } from '@/_mixins/titles.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';
import PersonList from '@/_components/PersonList.vue';
import numberFormatter from '@/_helpers/numberFormatter.js';

export default {
  name: 'CardPersonLeastVotesInCommon',
  components: {
    PersonList,
  },
  mixins: [
    common,
    personVotesContextUrl,
    personHeader,
    personOgImage,
    personTitle,
  ],
  data() {
    const { cardData } = this.$root.$options.contextData;

    const results = (cardData?.data?.results || [])
      .slice()
      .sort((a, b) => b.value - a.value);
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

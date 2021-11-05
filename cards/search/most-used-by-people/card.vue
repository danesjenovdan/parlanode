<template>
  <card-wrapper :header-config="headerConfig">
    <person-list :people="people" :show-party-link="true" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { searchContextUrl } from '@/_mixins/contextUrls.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import PersonList from '@/_components/PersonList.vue';
import numberFormatter from '@/_helpers/numberFormatter.js';

export default {
  name: 'CardSearchMostUsedByPeople',
  components: {
    PersonList,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContextUrl],
  data() {
    const { cardData } = this.$root.$options.contextData;

    const results = (cardData?.data?.results || [])
      .slice()
      .sort((a, b) => b.value - a.value);
    const people = results.map((entry) => ({
      ...entry.person,
      score: numberFormatter(entry.value),
    }));
    return {
      people,
    };
  },
};
</script>

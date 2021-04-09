<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <person-list :people="data.results" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import { partyOverview } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import PersonList from '@/_components/PersonList.vue';

export default {
  name: 'ClaniPoslanskeSkupine',
  components: {
    PersonList,
  },
  mixins: [common, partyOverview, partyTitle, partyHeader, partyOgImage],
  data() {
    return {
      data: this.$options.contextData.cardData,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.party.id}?altHeader=true`;
    },
  },
};
</script>

<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <person-list :people="data.members" />
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
  name: 'CardGroupMembers',
  components: {
    PersonList,
  },
  mixins: [common, partyOverview, partyTitle, partyHeader, partyOgImage],
  data() {
    return {
      data: this.cardData.data.results,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.cardData.id}?altHeader=true`;
    },
  },
};
</script>

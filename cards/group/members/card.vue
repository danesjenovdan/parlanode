<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <person-list :people="people" />
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
    const people = (this.cardData.data?.results || []).slice().sort((a, b) => {
      const aName = a.name || '';
      const bName = b.name || '';
      return aName.localeCompare(bName, 'sl');
    });
    return {
      people,
    };
  },
};
</script>

<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <person-list v-if="people.length > 2" :people="people" />
    <!-- TODO: empty state should take care of this -->
    <empty-circle v-else :text="$t('card.empty-state-text')" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { partyVotes } from '@/_mixins/contextUrls.js';
import { partyTitle } from '@/_mixins/titles.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import PersonList from '@/_components/PersonList.vue';
import EmptyCircle from '@/_components/EmptyCircle.vue';

export default {
  name: 'CardGroupDeviationFromGroup',
  components: {
    PersonList,
    EmptyCircle,
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

<style lang="scss" scoped>
:deep(.circle) {
  padding-top: 130px !important;
}
</style>

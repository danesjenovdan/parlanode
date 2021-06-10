<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
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
    const people = this.$options.contextData.cardData.results.map((o) => {
      const { person } = o;
      person.score = `${(o.ratio || 0).toFixed(2).replace('.', ',')} %`;
      return person;
    });
    return {
      data: this.$options.contextData.cardData,
      people,
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.organization.id}?altHeader=true`;
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.circle) {
  padding-top: 130px !important;
}
</style>

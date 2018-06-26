<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    contentHeight="518px"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text[0]'"></p>
      <p class="info-text" v-t="'info.text[1]'"></p>
    </div>
    <person-list :people="people" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import { partyHeader } from 'mixins/altHeaders';
import PersonList from 'components/PersonList.vue';

export default {
  components: {
    PersonList,
    partyOverview,
    partyTitle,
  },
  mixins: [
    common,
    partyHeader,
  ],
  name: 'NeujemanjeSPoslanskoSkupino',
  data() {
    const people = this.$options.cardData.data.results.map((o) => {
      const { person } = o;
      person.score = `${o.ratio.toFixed(2).replace('.', ',')} %`;
      return person;
    });
    const party = this.$options.cardData.data.organization;
    return {
      data: this.$options.cardData.data,
      party,
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

<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">Seznam vseh članov poslanske skupine.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Imena ter slike poslancev, ki predstavljajo posamezno poslansko skupino, črpamo s spletnega mesta <a href="http://www.dz-rs.si/wps/portal/Home/ODrzavnemZboru/KdoJeKdo/PoslanskeSkupine" target="_blank" class="funblue-light-hover">DZ RS</a>. Prikazani so samo trenutno aktivni poslanci.
      </p>
    </div>
    <person-list :people="data.results" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import PersonList from 'components/PersonList.vue';

export default {
  components: {
    PersonList,
  },
  mixins: [common, partyOverview, partyTitle],
  name: 'ClaniPoslanskeSkupine',
  data() {
    const { party } = this.$options.cardData.data;
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        heading: party.name,
        subheading: `${party.acronym} | ${party.is_coalition ? 'koalicija' : 'opozicija'}`,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
        circleText: party.acronym,
        circleClass: `${party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
      },
    };
  },
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.data.party.id}?altHeader=true`;
    },
  },
};
</script>

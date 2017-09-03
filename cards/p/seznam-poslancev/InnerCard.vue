<template>
  <div :class="['card-container', 'card-halfling', 'card-seznam-poslancev', transitionClass]">
    <card-header :config="headerConfig" :current-back="currentBack" />

    <div class="card-content">
      <card-info v-if="currentBack === 'info'">
        <div v-html="infoText"></div>
      </card-info>

      <card-embed v-else-if="currentBack === 'embed'" :url="generatedCardUrl" />

      <card-share v-else-if="currentBack === 'share'" :url="generatedCardUrl" />

      <div v-else class="card-content-front">
        <sortable-table
          class="person-list"
          :columns="columns"
          :items="mappedMembers"
          :sort="currentSort"
          :sort-order="currentSortOrder"
          :sort-callback="selectSort"
        />
      </div>
    </div>
    <card-footer @toggleBack="toggleBack" />
  </div>
</template>

<script>
import common from 'mixins/common';
import SortableTable from 'components/SortableTable.vue';
import { getPersonLink, getPersonPortrait, getPersonPartyLink } from 'components/links';

const arabicToRoman = arabic => ({
  0: '',
  1: 'I',
  2: 'II',
  3: 'III',
  4: 'IV',
  5: 'V',
  6: 'VI',
  7: 'VII',
  8: 'VIII',
}[arabic]);

export default {
  components: { SortableTable },
  mixins: [common],
  name: 'SeznamPoslancevInnerCard',
  computed: {
    mappedMembers() {
      if (this.demographics) {
        return this.processedMembers.map(member => [
          { link: getPersonLink(member), image: getPersonPortrait(member) },
          { link: getPersonLink(member), text: member.person.name },
          member.age,
          arabicToRoman(member.education),
          member.terms,
          { link: member.partylink ? getPersonPartyLink(member) : '', text: member.person.party.acronym },
          member.formattedDistrict,
        ]);
      }
      return this.processedMembers.map(member => [
        { link: getPersonLink(member), image: getPersonPortrait(member) },
        { link: getPersonLink(member), text: member.person.name },
        { barchart: true, value: member.analysisValue, width: member.analysisPercentage },
        member.analysisDiff,
      ]);
    },
    columns() {
      if (this.demographics) {
        return [
          { id: 'image', label: '', additionalClass: 'portrait' },
          { id: 'name', label: 'Ime', additionalClass: 'wider name' },
          { id: 'age', label: 'Starost' },
          { id: 'education', label: 'Stopnja izobrazbe', additionalClass: 'optional' },
          { id: 'terms', label: 'Število mandatov', additionalClass: 'optional' },
          { id: 'party', label: 'PS', additionalClass: 'optional' },
          { id: 'district', label: 'Okraj', additionalClass: 'optional' },
        ];
      }
      return [
        { id: 'image', label: '', additionalClass: 'portrait' },
        { id: 'name', label: 'Ime', additionalClass: 'name' },
        { id: 'analysis', label: 'Analiza', additionalClass: 'wider barchartcontainer' },
        { id: 'change', label: 'Sprememba' },
      ];
    },
  },
  props: {
    demographics: Boolean,
    headerConfig: Object,
    generatedCardUrl: String,
    currentSort: String,
    currentSortOrder: String,
    processedMembers: Array,
    currentAnalysisData: Object,
    infoText: String,
  },
  methods: {
    selectSort(sort) {
      this.$emit('sort', sort);
    },
  },
};
</script>

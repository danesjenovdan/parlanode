<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info" v-html="infoText"></div>

    <sortable-table
      class="person-list"
      :columns="columns"
      :items="mappedMembers"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
    />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import SortableTable from 'components/SortableTable.vue';
import { getMemberLink, getMemberPortrait, getMemberPartyLink } from 'components/links';

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
          { link: getMemberLink(member), image: getMemberPortrait(member) },
          { link: getMemberLink(member), text: member.person.name },
          member.age,
          arabicToRoman(member.education),
          member.terms,
          { link: member.partylink ? getMemberPartyLink(member) : '', text: member.person.party.acronym },
          member.formattedDistrict,
        ]);
      }
      return this.processedMembers.map(member => [
        { link: getMemberLink(member), image: getMemberPortrait(member) },
        { link: getMemberLink(member), text: member.person.name },
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
  created() {
    this.$root.$options.cardData.template.contextUrl = `${this.slugs.base}/poslanci`;
  },
};
</script>

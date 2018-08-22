<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <slot slot="info" name="info"></slot>

    <sortable-table
      :columns="columns"
      :items="mappedMembers"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
      class="person-list"
    />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import SortableTable from 'components/SortableTable.vue';
import links from 'mixins/links';
import { memberList } from 'mixins/contextUrls';

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
  name: 'SeznamPoslancevInnerCard',
  components: { SortableTable },
  mixins: [
    common,
    links,
    memberList,
  ],
  props: {
    demographics: {
      type: Boolean,
      default: false,
    },
    headerConfig: {
      type: Object,
      default: () => ({}),
    },
    ogConfig: {
      type: Object,
      default: null,
    },
    generatedCardUrl: {
      type: String,
      default: '',
    },
    currentSort: {
      type: String,
      default: '',
    },
    currentSortOrder: {
      type: String,
      default: '',
    },
    processedMembers: {
      type: Array,
      default: () => [],
    },
    currentAnalysisData: {
      type: Object,
      default: () => ({}),
    },
  },
  computed: {
    mappedMembers() {
      if (this.demographics) {
        return this.processedMembers.map(member => [
          { link: this.getMemberLink(member), image: this.getMemberPortrait(member) },
          { link: this.getMemberLink(member), text: member.person.name },
          member.age,
          arabicToRoman(member.education),
          member.terms,
          { link: member.partylink ? this.getMemberPartyLink(member) : '', text: member.person.party.acronym },
          member.formattedDistrict,
        ]);
      }
      return this.processedMembers.map(member => [
        { link: this.getMemberLink(member), image: this.getMemberPortrait(member) },
        { link: this.getMemberLink(member), text: member.person.name },
        { barchart: true, value: member.analysisValue, width: member.analysisPercentage },
        member.analysisDiff,
      ]);
    },
    columns() {
      if (this.demographics) {
        return [
          { id: 'image', label: '', additionalClass: 'portrait' },
          { id: 'name', label: this.$t('name'), additionalClass: 'wider name' },
          { id: 'age', label: this.$t('age') },
          { id: 'education', label: this.$t('education'), additionalClass: 'optional' },
          { id: 'terms', label: this.$t('number-of-terms'), additionalClass: 'optional' },
          { id: 'party', label: this.$t('party'), additionalClass: 'optional' },
          { id: 'district', label: this.$t('district'), additionalClass: 'optional' },
        ];
      }
      return [
        { id: 'image', label: '', additionalClass: 'portrait' },
        { id: 'name', label: this.$t('name'), additionalClass: 'name' },
        { id: 'analysis', label: this.$t('analysis'), additionalClass: 'wider barchartcontainer' },
        { id: 'change', label: this.$t('change') },
      ];
    },
  },
  methods: {
    selectSort(sort) {
      this.$emit('sort', sort);
    },
  },
};
</script>

<style lang="scss">
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.person-list .headers .column {
  white-space: normal;
  color: $font-default;
}

.person-list .headers .barchartcontainer,
.person-list .item .barchartcontainer {
  @include respond-to(mobile) {
    display: none;
  }
}
</style>

<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <slot slot="info" name="info"></slot>

    <sortable-table
      :columns="columns"
      :items="currentPageMembers"
      :sort="currentSort"
      :sort-order="currentSortOrder"
      :sort-callback="selectSort"
      class="person-list"
    />
    <pagination
      v-if="count > perPage"
      :page="currentPage"
      :count="count"
      :per-page="perPage"
      @change="onPageChange"
    />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import SortableTable from 'components/SortableTable.vue';
import Pagination from 'components/Pagination.vue';
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
  components: {
    SortableTable,
    Pagination,
  },
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
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  data() {
    return {
      perPage: 50,
    };
  },
  computed: {
    count() {
      return this.processedMembers.length;
    },
    currentPageMembers() {
      const start = (this.currentPage - 1) * this.perPage;
      const end = start + this.perPage;
      return this.mappedMembers.slice(start, end);
    },
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
  watch: {
    processedMembers() {
      this.onPageChange(1);
    },
  },
  methods: {
    selectSort(sort) {
      this.$emit('sort', sort);
    },
    onPageChange(newPage) {
      this.scrollToTop();
      this.$emit('page-change', newPage);
    },
    scrollToTop() {
      const { _id: id } = this.$root.$options.cardData.cardData;
      const el = document.getElementById(id);
      // only scroll up if top is not visible
      if (el && el.getBoundingClientRect().top < 0) {
        el.scrollIntoView();
      }
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

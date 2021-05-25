<template>
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
</template>

<script>
import common from '@/_mixins/common.js';
import SortableTable from '@/_components/SortableTable.vue';
import Pagination from '@/_components/Pagination.vue';
import links from '@/_mixins/links.js';
import { memberList } from '@/_mixins/contextUrls.js';

export default {
  name: 'SeznamPoslancevInnerCard',
  components: {
    SortableTable,
    Pagination,
  },
  mixins: [common, links, memberList],
  props: {
    demographics: {
      type: Boolean,
      default: false,
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
    currentPage: {
      type: Number,
      default: 1,
    },
  },
  emits: ['sort', 'page-change'],
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
        return this.processedMembers.map((member) => [
          {
            link: this.getPersonLink(member),
            image: this.getPersonPortrait(member),
          },
          { link: this.getPersonLink(member), text: member.name },
          member.age,
          member.education,
          member.terms,
          {
            link: member.partylink ? this.getMemberPartyLink(member) : '',
            text: member.party?.acronym,
          },
          member.formattedDistrict,
        ]);
      }
      return this.processedMembers.map((member) => [
        {
          link: this.getPersonLink(member),
          image: this.getPersonPortrait(member),
        },
        { link: this.getPersonLink(member), text: member.name },
        {
          barchart: true,
          value: member.analysisValue,
          width: member.analysisPercentage,
        },
        member.analysisDiff,
      ]);
    },
    columns() {
      if (this.demographics) {
        return [
          { id: 'image', label: '', additionalClass: 'portrait' },
          { id: 'name', label: this.$t('name'), additionalClass: 'wider name' },
          { id: 'age', label: this.$t('age') },
          {
            id: 'education',
            label: this.$t('education'),
            additionalClass: 'optional',
          },
          {
            id: 'terms',
            label: this.$t('number-of-terms'),
            additionalClass: 'optional',
          },
          { id: 'party', label: this.$t('party'), additionalClass: 'optional' },
          {
            id: 'district',
            label: this.$t('district'),
            additionalClass: 'optional',
          },
        ];
      }
      return [
        { id: 'image', label: '', additionalClass: 'portrait' },
        { id: 'name', label: this.$t('name'), additionalClass: 'name' },
        {
          id: 'analysis',
          label: this.$t('analysis'),
          additionalClass: 'wider barchartcontainer',
        },
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
      const id = this.$root.$options.contextData.mountId;
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
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

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

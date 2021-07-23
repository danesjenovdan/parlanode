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
    currentAnalysis: {
      type: String,
      default: 'demographics',
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
      if (this.currentAnalysis === 'demographics') {
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
            link: this.getPartyLink(member?.group),
            text: member.group?.acronym || member.group?.name || 'N/A',
          },
          // member.formattedDistrict,
        ]);
      }
      if (this.currentAnalysis === 'working_bodies') {
        return this.processedMembers.map((member) => [
          {
            link: this.getPersonLink(member),
            image: this.getPersonPortrait(member),
          },
          { link: this.getPersonLink(member), text: member.name },
          {
            text: member.workingBodies.map((wb) => wb.name).join(', '),
          },
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
        // member.analysisDiff,
      ]);
    },
    columns() {
      if (this.currentAnalysis === 'demographics') {
        return [
          { id: 'image', label: 'image', additionalClass: 'portrait' },
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
          {
            id: 'party',
            label: this.$t('party'),
            additionalClass: 'optional',
          },
          // {
          //   id: 'district',
          //   label: this.$t('district'),
          //   additionalClass: 'optional',
          // },
        ];
      }
      if (this.currentAnalysis === 'working_bodies') {
        return [
          { id: 'image', label: 'image', additionalClass: 'portrait' },
          { id: 'name', label: this.$t('name'), additionalClass: 'name' },
          {
            id: 'working-bodies',
            label: this.$t('working-bodies'),
            additionalClass: 'wider working-bodies-col',
          },
        ];
      }
      return [
        { id: 'image', label: 'image', additionalClass: 'portrait' },
        { id: 'name', label: this.$t('name'), additionalClass: 'name' },
        {
          id: 'analysis',
          label: this.$t('analysis'),
          additionalClass: 'wider barchartcontainer',
        },
        // { id: 'change', label: this.$t('change') },
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
      // eslint-disable-next-line no-restricted-properties
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

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.person-list :deep(.column) {
  &.name,
  &.working-bodies-col,
  &.barchartcontainer {
    text-align: left;
  }

  &.barchartcontainer {
    @include respond-to(mobile) {
      display: none;
    }
  }
}

.person-list :deep(.headers) {
  margin-left: 0;

  .column.portrait {
    flex: none;
    width: 80px + 18px - 16px;
    visibility: hidden;
  }
}

.person-list :deep(.headers) {
  height: 40px;

  .column {
    white-space: normal;
  }
}
</style>

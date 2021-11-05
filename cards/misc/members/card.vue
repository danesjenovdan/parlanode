<template>
  <card-wrapper ref="card" :header-config="headerConfig" max-height>
    <template #generator>
      <div class="party-list-generator">
        <div class="row">
          <div class="col-md-12">
            <blue-button-list v-model="currentAnalysis" :items="analyses" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 filters">
            <search-field
              v-model="textFilter"
              @update:modelValue="searchPeople"
            />
            <p-search-dropdown
              v-model="groups"
              :placeholder="partiesPlaceholder"
              class="filter parties"
            />
            <p-search-dropdown
              v-if="showWorkingBodies"
              v-model="workingBodies"
              :placeholder="workingBodyPlaceholder"
              class="filter working-bodies"
            />
            <div class="genders filter">
              <striped-button
                v-for="gender in genders"
                :key="gender.id"
                :selected="selectedGenders.indexOf(gender.id) > -1"
                :class="['gender', gender.icon]"
                color="for"
                @click="selectGender(gender.id)"
              />
            </div>
          </div>
        </div>
      </div>
    </template>
    <div v-if="isLoading" class="nalagalnik"></div>
    <template v-else>
      <sortable-table
        :columns="columns"
        :items="currentPageProcessedMembers"
        :sort="currentSort"
        :sort-order="currentSortOrder"
        :sort-callback="sortBy"
        class="person-list"
      />
      <pagination
        v-if="count > perPage"
        :page="page"
        :count="count"
        :per-page="perPage"
        @change="onPageChange"
      />
    </template>
  </card-wrapper>
</template>

<script>
import { debounce, find } from 'lodash-es';
import { parseISO, differenceInCalendarYears } from 'date-fns';
import { MEMBERS_PER_PAGE } from '@/_helpers/constants.js';
import numberFormatter from '@/_helpers/numberFormatter.js';
import common from '@/_mixins/common.js';
import cancelableRequest from '@/_mixins/cancelableRequest.js';
import links from '@/_mixins/links.js';
import { memberList } from '@/_mixins/contextUrls.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import SearchField from '@/_components/SearchField.vue';
import StripedButton from '@/_components/StripedButton.vue';
import SortableTable from '@/_components/SortableTable.vue';
import Pagination from '@/_components/Pagination.vue';

function getAge(date) {
  if (!date) {
    return 0;
  }
  return differenceInCalendarYears(new Date(), parseISO(date));
}

const analysesIDs = [
  {
    id: 'demographics',
  },
  {
    id: 'presence_votes',
    unit: 'percent',
  },
  {
    id: 'number_of_questions',
  },
  {
    id: 'speeches_per_session',
  },
  // {
  //   id: 'spoken_words',
  // },
  // {
  //   id: 'mismatch_of_pg',
  // },
  {
    id: 'working_bodies',
  },
];

export default {
  name: 'CardMiscMembers',
  components: {
    BlueButtonList,
    PSearchDropdown,
    SearchField,
    StripedButton,
    SortableTable,
    Pagination,
  },
  mixins: [common, links, memberList, cancelableRequest],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardState, cardData } = this.$root.$options.contextData;

    const {
      results = [],
      pages = 1,
      page: initialPage = 1,
      count = results?.length ?? 0,
      per_page = MEMBERS_PER_PAGE,
    } = cardData?.data || {};

    const membersPerPage = Array(pages);
    membersPerPage[initialPage - 1] = results;

    const page = Number(cardState?.page) || initialPage;

    const genders = [
      { id: 'he', icon: 'gender-m', selected: false },
      { id: 'she', icon: 'gender-f', selected: false },
    ];

    // TODO: get list of groups and all working bodies from api (because pagination)
    // TODO: and update the readme.md
    // const selectedGroups = cardState?.groups || [];
    // const groups = uniqBy(results.map((m) => m.group).filter(Boolean), 'slug')
    //   .sort((a, b) => {
    //     const aName = (a.name || '').toLowerCase();
    //     const bName = (b.name || '').toLowerCase();
    //     return aName.localeCompare(bName, 'sl');
    //   })
    //   .map((g) => ({
    //     id: g.slug,
    //     slug: g.slug,
    //     label: g.name,
    //     selected: selectedGroups.includes(g.slug),
    //     // colorClass: `${g.acronym
    //     //   .toLowerCase()
    //     //   .replace(/[ +,]/g, '_')}-background`,
    //   }));

    // const selectedWorkingBodyIds = cardState?.workingBodies || [];
    // const workingBodies = uniqBy(
    //   results.flatMap((m) => m.results?.working_bodies || []).filter(Boolean),
    //   'slug'
    // )
    //   .sort((a, b) => {
    //     const aName = (a.name || '').toLowerCase();
    //     const bName = (b.name || '').toLowerCase();
    //     return aName.localeCompare(bName, 'sl');
    //   })
    //   .map((wb) => ({
    //     id: wb.slug,
    //     slug: wb.slug,
    //     label: wb.name,
    //     selected: selectedWorkingBodyIds.includes(wb.slug),
    //   }));
    const groups = [];
    const workingBodies = [];
    // END TODO

    const analyses = analysesIDs.map((a) => ({
      ...a,
      label: this.$te(`analysis-texts.${a.id}.label`)
        ? this.$t(`analysis-texts.${a.id}.label`)
        : '',
      titleSuffix: this.$te(`analysis-texts.${a.id}.titleSuffix`)
        ? this.$t(`analysis-texts.${a.id}.titleSuffix`)
        : '',
      explanation: this.$te(`analysis-texts.${a.id}.explanation`)
        ? this.$t(`analysis-texts.${a.id}.explanation`)
        : '',
    }));

    const initialTextFilter = cardState?.text || '';

    return {
      membersPerPage,
      count,
      perPage: per_page,
      page,
      pages,
      initialPage,
      isLoading: false,
      currentAnalysis: cardState?.analysis || 'demographics',
      analyses,
      textFilter: initialTextFilter,
      groups,
      showWorkingBodies: cardState?.showWorkingBodies || false,
      workingBodies,
      genders,
      selectedGenders: cardState?.genders || [],
      currentSort: cardState?.sort || 'name',
      currentSortOrder: cardState?.sortOrder || 'asc',
    };
  },
  computed: {
    partiesPlaceholder() {
      return this.selectedGroups.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedGroups.length })
        : this.$t('select-parties-placeholder');
    },
    workingBodyPlaceholder() {
      return this.selectedWorkingBodyIds.length > 0
        ? this.$t('selected-placeholder', {
            num: this.selectedWorkingBodyIds.length,
          })
        : this.$t('select-working-body-placeholder');
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
    currentPageMembers() {
      return this.membersPerPage[this.page - 1] || [];
    },
    currentPageProcessedMembers() {
      // TODO: get max analysis value from api
      const analysisMax = 0;
      // if (this.currentAnalysis !== 'demographics') {
      //   analysisMax =
      //     this.membersPerPage?.[0]?.[0]?.results?.[this.currentAnalysis] || 0;
      // }
      // END TODO

      // TODO: filter and sort from api (because pagination)
      const filtered = this.currentPageMembers
        .filter((member) => {
          let partyMatch = true;
          let workingBodyMatch = true;
          let genderMatch = true;

          if (this.selectedGroups.length > 0) {
            partyMatch =
              member.group?.slug &&
              this.selectedGroups.find((p) => p.slug === member.group?.slug) !=
                null;
          }
          if (this.selectedWorkingBodyIds.length > 0) {
            const wbs = member.results?.working_bodies || [];
            workingBodyMatch = wbs.some((wb) =>
              this.selectedWorkingBodyIds.includes(wb?.slug)
            );
          }
          if (this.selectedGenders.length > 0) {
            genderMatch = this.selectedGenders.includes(
              member.preferred_pronoun
            );
          }

          return partyMatch && workingBodyMatch && genderMatch;
        })
        .map((member) => {
          const newMember = JSON.parse(JSON.stringify(member));

          newMember.age = getAge(newMember.results?.birth_date) || '';
          const education = newMember.results?.education;
          newMember.education = String(education || 0);
          newMember.terms = newMember.results?.mandates || 1;
          if (this.currentAnalysis === 'working_bodies') {
            const wbs = newMember.results?.working_bodies || [];
            newMember.workingBodies = wbs.filter(Boolean);
          } else if (this.currentAnalysis !== 'demographics') {
            const score = newMember.results?.[this.currentAnalysis] || 0;
            const formattedScore = numberFormatter(score, {
              precision: this.currentAnalysisData?.precision || 0,
              percent: this.currentAnalysisData?.unit === 'percent',
            });
            newMember.analysisValue = formattedScore;
            newMember.analysisPercentage =
              analysisMax > 0 ? (score / analysisMax) * 100 : 0;
            // const diff =
            //   Math.round(newMember.results?.[this.currentAnalysis].diff * 10) /
            //   10;
            // newMember.analysisDiff = (diff > 0 ? '+' : '') + diff;
          }
          return newMember;
        });
      // END TODO filter and sort

      if (this.currentAnalysis === 'demographics') {
        return filtered.map((member) => [
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
        ]);
      }
      if (this.currentAnalysis === 'working_bodies') {
        return filtered.map((member) => [
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
      return filtered.map((member) => [
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
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    headerConfig() {
      return defaultHeaderConfig(this, {
        title: `${this.$t('card.title')} ${
          this.currentAnalysisData.titleSuffix
        }`,
      });
    },
    ogConfig() {
      return defaultOgImage(this, {
        title: `${this.$t('card.title')} ${
          this.currentAnalysisData.titleSuffix
        }`,
      });
    },
    selectedGroups() {
      return this.groups.filter((group) => group.selected);
    },
    selectedWorkingBodyIds() {
      return this.workingBodies
        .filter((workingBody) => workingBody.selected)
        .map((workingBody) => workingBody.id);
    },
    searchUrl() {
      const url = new URL(this.cardData.url);
      url.searchParams.set('page', this.page);
      url.searchParams.set('text', this.textFilter);
      const sortPrefix = this.currentSortOrder === 'desc' ? '-' : '';
      const sort =
        this.currentSort === 'analysis'
          ? this.currentAnalysis
          : this.currentSort;
      url.searchParams.set('order_by', `${sortPrefix}${sort}`);
      return url.toString();
    },
  },
  watch: {
    currentAnalysis(newValue) {
      if (newValue === 'demographics' || newValue === 'working_bodies') {
        this.currentSort = 'name';
        this.currentSortOrder = 'asc';
      } else {
        this.currentSort = 'analysis';
        this.currentSortOrder = 'desc';
      }
      this.searchPeopleImmediate();
    },
    currentSort() {
      this.searchPeopleImmediate(true);
    },
    currentSortOrder() {
      this.searchPeopleImmediate(true);
    },
  },
  methods: {
    selectGender(id) {
      const position = this.selectedGenders.indexOf(id);
      if (position > -1) {
        this.selectedGenders = [];
      } else {
        this.selectedGenders = [id];
      }
    },
    sortBy(sort) {
      if (this.currentSort === sort) {
        this.currentSortOrder =
          this.currentSortOrder === 'desc' ? 'asc' : 'desc';
      } else {
        this.currentSortOrder = 'asc';
        this.currentSort = sort;
      }
    },
    onPageChange(newPage) {
      this.page = newPage;
      this.scrollToTop();
      if (!this.membersPerPage[newPage - 1]) {
        this.isLoading = true;
        this.makeRequest(this.searchUrl).then((response) => {
          this.membersPerPage[newPage - 1] = response?.data?.results || [];
          this.isLoading = false;
        });
      }
    },
    searchPeopleImmediate(keepPage = false) {
      this.isLoading = true;
      this.membersPerPage = Array(this.pages);
      this.count = 0;
      if (!keepPage) {
        this.page = 1;
      }
      this.makeRequest(this.searchUrl).then((response) => {
        this.membersPerPage[0] = response?.data?.results || [];
        this.count = response?.data?.count;
        this.page = response?.data?.page;
        this.isLoading = false;
      });
    },
    searchPeople: debounce(function searchPeople() {
      this.searchPeopleImmediate();
    }, 750),
    scrollToTop() {
      const el = this.$refs.card?.$el || this.$refs.card;
      el.scrollIntoView();
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.blue-button-list-item {
  font-size: 12px;
}

.filters {
  display: flex;
  margin-top: 14px;

  .filter:not(:first-child) {
    margin-left: 3px;
  }

  .filter {
    flex: 1;
  }

  .search-field {
    flex: 1.2;
  }

  .filter.genders {
    display: flex;
    flex: 0 1 auto;

    .gender {
      width: 40px;
      background-repeat: no-repeat;
      background-position: center center;
      background-size: 50%;

      &:not(:last-child) {
        margin-right: 3px;
      }

      &.gender-m {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M63.472,6.5v10l12.957,0L63.584,29.345c-6.145-4.641-13.592-7.157-21.429-7.157c-9.524,0-18.479,3.709-25.214,10.444  C3.042,46.534,3.042,69.154,16.942,83.057C23.678,89.791,32.632,93.5,42.155,93.5c9.524,0,18.479-3.709,25.214-10.444  c12.7-12.702,13.789-32.677,3.281-46.636L83.5,23.571l-0.001,12.956h10L93.5,6.5L63.472,6.5z M60.298,75.985  C55.451,80.831,49.009,83.5,42.155,83.5c-6.853,0-13.296-2.669-18.142-7.514c-10.002-10.003-10.002-26.28-0.001-36.283  c4.847-4.846,11.289-7.515,18.143-7.515s13.296,2.668,18.142,7.515C70.3,49.706,70.3,65.982,60.298,75.985z"/></svg>');
      }

      &.gender-f {
        background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><path d="M82.301,35.467C82.3,17.656,67.81,3.166,50.001,3.166c-17.812,0-32.302,14.49-32.302,32.301  c0,16.11,11.856,29.502,27.301,31.912v8.171h-9.189v10H45v8.284h10V85.55h9.189v-10H55v-8.171  C70.444,64.969,82.301,51.577,82.301,35.467z M27.699,35.467c0-12.297,10.005-22.301,22.302-22.301  c12.295,0,22.299,10.004,22.3,22.301c0,12.297-10.004,22.301-22.301,22.301S27.699,47.764,27.699,35.467z"/></svg>');
      }
    }
  }

  @include respond-to(mobile) {
    flex-wrap: wrap;

    .search-field {
      flex-basis: auto;
      order: 1;
      margin-top: 5px;
    }

    .filter.parties {
      margin: 0;
    }

    .genders {
      .gender {
        height: 100%;
      }
    }
  }
}

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

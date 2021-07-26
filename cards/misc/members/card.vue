<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig" max-height>
    <template #generator>
      <div class="party-list-generator">
        <div class="row">
          <div class="col-md-12">
            <blue-button-list v-model="currentAnalysis" :items="analyses" />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 filters">
            <search-field v-model="textFilter" />
            <p-search-dropdown
              v-model="groups"
              :placeholder="partiesPlaceholder"
              class="filter parties"
            />
            <p-search-dropdown
              v-model="workingBodies"
              :placeholder="workingBodyPlaceholder"
              class="filter working-bodies"
            />
            <!-- <p-search-dropdown
              v-model="districts"
              :placeholder="districtPlaceholder"
              class="filter district"
            /> -->
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
    <inner-card
      :processed-members="processedMembers"
      :current-sort="currentSort"
      :current-sort-order="currentSortOrder"
      :current-page="currentPage"
      :current-analysis="currentAnalysis"
      @sort="sortBy"
      @page-change="onPageChange"
    />
  </card-wrapper>
</template>

<script>
import stableSort from 'stable';
import { find, uniqBy } from 'lodash-es';
import { parseISO, differenceInCalendarYears } from 'date-fns';
import numberFormatter from '@/_helpers/numberFormatter.js';
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import SearchField from '@/_components/SearchField.vue';
import StripedButton from '@/_components/StripedButton.vue';
import InnerCard from './InnerCard.vue';

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
    InnerCard,
    PSearchDropdown,
    SearchField,
    StripedButton,
  },
  mixins: [common],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    // const selectedDistrictIds = this.cardState.districts || [];
    // const districts = (this.cardData.districts || []).map((district) => {
    //   const id = Object.keys(district)[0];
    //   return {
    //     id,
    //     label: district[id],
    //     selected: selectedDistrictIds.indexOf(id) !== -1,
    //   };
    // });

    const genders = [
      { id: 'he', icon: 'gender-m', label: 'moški', selected: false },
      { id: 'she', icon: 'gender-f', label: 'ženski', selected: false },
    ];

    const members = this.cardData.data?.results || [];

    const selectedGroups = this.cardState.groups || [];
    const groups = uniqBy(members.map((m) => m.group).filter(Boolean), 'slug')
      .sort((a, b) => {
        const aName = (a.name || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        return aName.localeCompare(bName, 'sl');
      })
      .map((g) => ({
        id: g.slug,
        slug: g.slug,
        label: g.name,
        selected: selectedGroups.includes(g.slug),
        // colorClass: `${g.acronym
        //   .toLowerCase()
        //   .replace(/[ +,]/g, '_')}-background`,
      }));

    const selectedWorkingBodies = this.cardState.workingBodies || [];
    const workingBodies = uniqBy(
      members.flatMap((m) => m.results?.working_bodies || []).filter(Boolean),
      'slug'
    )
      .sort((a, b) => {
        const aName = (a.name || '').toLowerCase();
        const bName = (b.name || '').toLowerCase();
        return aName.localeCompare(bName, 'sl');
      })
      .map((wb) => ({
        id: wb.slug,
        slug: wb.slug,
        label: wb.name,
        selected: selectedWorkingBodies.includes(wb.slug),
      }));

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

    return {
      members,
      currentAnalysis: this.cardState.analysis || 'demographics',
      currentSort: this.cardState.sort || 'name',
      currentSortOrder: this.cardState.sortOrder || 'asc',
      currentPage: this.cardState.page || 1,
      analyses,
      groups,
      textFilter: this.cardState.textFilter || '',
      districts: [],
      workingBodies,
      genders,
      selectedGenders: this.cardState.genders || [],
    };
  },
  computed: {
    selectedDistrictNames() {
      return this.districts
        .filter((district) => district.selected)
        .map((district) => district.label);
    },
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    partiesPlaceholder() {
      return this.selectedGroups.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedGroups.length })
        : this.$t('select-parties-placeholder');
    },
    workingBodyPlaceholder() {
      return this.selectedWorkingBodies.length > 0
        ? this.$t('selected-placeholder', {
            num: this.selectedWorkingBodies.length,
          })
        : this.$t('select-working-body-placeholder');
    },
    districtPlaceholder() {
      return this.selectedDistricts.length > 0
        ? this.$t('selected-placeholder', {
            num: this.selectedDistricts.length,
          })
        : this.$t('select-district-placeholder');
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
      return this.groups.filter((party) => party.selected);
    },
    selectedWorkingBodies() {
      return this.workingBodies
        .filter((workingBody) => workingBody.selected)
        .map((workingBody) => workingBody.id);
    },
    selectedDistricts() {
      return this.districts
        .filter((district) => district.selected)
        .map((district) => district.id);
    },
    urlParameters() {
      const parameters = {};

      if (this.textFilter) {
        parameters.textFilter = this.textFilter;
      }
      if (this.currentAnalysis !== 'demographics') {
        parameters.analysis = this.currentAnalysis;
      }
      if (this.currentSort !== 'name') {
        parameters.sort = this.currentSort;
      }
      if (this.currentSortOrder !== 'asc') {
        parameters.sortOrder = this.currentSortOrder;
      }
      if (this.selectedGroups.length > 0) {
        parameters.groups = this.selectedGroups.map((party) => party.slug);
      }
      if (this.selectedGenders.length > 0) {
        parameters.genders = this.selectedGenders;
      }
      if (this.selectedDistricts.length > 0) {
        parameters.districts = this.selectedDistricts;
      }
      if (this.selectedWorkingBodies.length > 0) {
        parameters.workingBodies = this.selectedWorkingBodies;
      }
      if (this.currentPage > 1) {
        parameters.page = this.currentPage;
      }

      return parameters;
    },
    processedMembers() {
      let analysisMax = 0;
      if (this.currentAnalysis !== 'demographics') {
        analysisMax = this.members.reduce(
          (biggest, member) =>
            Math.max(biggest, member.results?.[this.currentAnalysis] || 0),
          0
        );
      }

      const lowerTextFilter = String(this.textFilter || '').toLowerCase();

      const filtered = this.members
        .filter((member) => {
          let partyMatch = true;
          // let districtMatch = true;
          let workingBodyMatch = true;
          let genderMatch = true;
          let textMatch = true;

          if (lowerTextFilter) {
            textMatch = member.name.toLowerCase().includes(lowerTextFilter);
          }
          if (this.selectedGroups.length > 0) {
            partyMatch =
              member.group?.slug &&
              this.selectedGroups.find((p) => p.slug === member.group?.slug) !=
                null;
          }
          // if (this.selectedDistricts.length > 0) {
          //   districtMatch = member.person.district.reduce(
          //     (prevMatch, memberDistrict) =>
          //       prevMatch ||
          //       this.selectedDistricts.indexOf(String(memberDistrict)) > -1,
          //     false
          //   );
          // }
          if (this.selectedWorkingBodies.length > 0) {
            const wbs = member.results?.working_bodies || [];
            workingBodyMatch = wbs.some((wb) =>
              this.selectedWorkingBodies.includes(wb?.slug)
            );
          }
          if (this.selectedGenders.length > 0) {
            genderMatch = this.selectedGenders.includes(
              member.preferred_pronoun
            );
          }

          return (
            textMatch &&
            partyMatch &&
            // districtMatch &&
            workingBodyMatch &&
            genderMatch
          );
        })
        .map((member) => {
          const newMember = JSON.parse(JSON.stringify(member));
          if (!newMember.district?.length) {
            newMember.formattedDistrict = this.$t('missing-district');
          } else {
            newMember.formattedDistrict = newMember.person.district
              .map(
                (memberDistrict) =>
                  find(this.districts, { id: String(memberDistrict) }).label
              )
              .join(', ');
          }

          newMember.age = getAge(newMember.results?.birth_date) || '';
          const education = newMember.results?.education;
          newMember.education = String(education || 0);
          newMember.terms = newMember.results?.mandates || 1;
          if (this.currentAnalysis === 'working_bodies') {
            const wbs = newMember.results?.working_bodies || [];
            newMember.workingBodies = wbs.filter(Boolean);
          } else if (this.currentAnalysis !== 'demographics') {
            const score = newMember.results?.[this.currentAnalysis] || 0;
            const formattedScore = numberFormatter(
              score,
              this.currentAnalysisData?.precision || 0,
              this.currentAnalysisData?.unit === 'percent'
            );
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

      const sortedAndFiltered = stableSort(filtered, (memberA, memberB) => {
        let a;
        let b;
        switch (this.currentSort) {
          // case 'change':
          //   a = memberA.results?.[this.currentAnalysis].diff;
          //   b = memberB.results?.[this.currentAnalysis].diff;
          //   return a - b;
          case 'analysis':
            a = memberA.results?.[this.currentAnalysis] || 0;
            b = memberB.results?.[this.currentAnalysis] || 0;
            return a - b;
          case 'name':
            a = memberA.name;
            b = memberB.name;
            return a.localeCompare(b, 'sl');
          case 'district':
            a = memberA.formattedDistrict;
            b = memberB.formattedDistrict;
            return a.localeCompare(b, 'sl');
          case 'party':
            a = (memberA.group?.name || '').toLowerCase();
            b = (memberB.group?.name || '').toLowerCase();
            return a.localeCompare(b, 'sl');
          case 'education':
            a = parseFloat(
              String(memberA.results.education.score).replace('/', '.'),
              10
            );
            b = parseFloat(
              String(memberB.results.education.score).replace('/', '.'),
              10
            );
            return a - b;
          default:
            a = memberA[this.currentSort];
            b = memberB[this.currentSort];
            return a - b;
        }
      });

      if (this.currentSortOrder === 'desc') {
        sortedAndFiltered.reverse();
      }

      return sortedAndFiltered;
    },
    sortMap() {
      return {
        name: this.$t('sort-by--name'),
        district: this.$t('sort-by--district'),
        party: this.$t('sort-by--party'),
        analysis: this.$t('sort-by--analysis', {
          analysis: this.currentAnalysisData.label,
        }),
        change: this.$t('sort-by--change', {
          analysis: this.currentAnalysisData.label,
        }),
        age: this.$t('sort-by--age'),
        education: this.$t('sort-by--education'),
        terms: this.$t('sort-by--terms'),
      };
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
    },
  },
  methods: {
    selectGender(id) {
      const position = this.selectedGenders.indexOf(id);
      if (position > -1) {
        this.selectedGenders.splice(position, 1);
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
      this.currentPage = newPage;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';

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

    .filter.district {
      display: none;
    }

    .genders {
      .gender {
        height: 100%;
      }
    }
  }
}
</style>

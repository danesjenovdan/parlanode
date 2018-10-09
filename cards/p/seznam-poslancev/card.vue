<template>
  <div :id="$options.cardData.cardData._id">
    <generator>
      <div slot="generator" class="party-list-generator">
        <div class="row">
          <div class="col-md-12">
            <blue-button-list
              :items="analyses"
              v-model="currentAnalysis"
            />
          </div>
        </div>
        <div class="row">
          <div class="col-md-12 filters">
            <search-field v-model="textFilter" class="filter text-filter" />
            <p-search-dropdown
              v-model="parties"
              :placeholder="partiesPlaceholder"
              class="filter parties"
            />
            <p-search-dropdown
              v-model="districts"
              :placeholder="districtPlaceholder"
              class="filter district"
            />
            <div class="genders filter">
              <striped-icon-button
                v-for="gender in genders"
                :color="'funblue'"
                :key="gender.id"
                :selected="selectedGenders.indexOf(gender.id) > -1"
                :icon="gender.id"
                :stripe-position="'top'"
                class="gender"
                @click.native="selectGender(gender.id)"
              />
            </div>
          </div>
        </div>
      </div>
      <inner-card
        :header-config="headerConfig"
        :og-config="ogConfig"
        :generated-card-url="generatedCardUrl"
        :current-analysis-data="currentAnalysisData"
        :processed-members="processedMembers"
        :current-sort="currentSort"
        :current-sort-order="currentSortOrder"
        :current-page="currentPage"
        :demographics="currentAnalysis === 'demographics'"
        @sort="sortBy"
        @page-change="onPageChange"
      >
        <div slot="info">
          <i18n path="info.lead" tag="p" class="info-text lead">
            <span place="parties">
              <span v-if="selectedParties.length">{{
                `${$t('party')}: ${selectedParties.map(p => p.acronym).join(', ')}`
              }}</span>
              <span v-t="'all-parties'" v-else></span>
            </span>
            <span place="districts">
              <span v-if="selectedDistrictNames.length">{{
                `${$t('voting-district')}: ${selectedDistrictNames.join(', ')}`
              }}</span>
              <span v-t="'all-voting-districts'" v-else></span>
            </span>
            <span place="sortBy">{{ sortMap[currentSort] }}</span>
          </i18n>
          <template v-if="currentAnalysisData.explanation">
            <p v-t="'info.methodology'" class="info-text heading"></p>
            <p class="info-text">{{ currentAnalysisData.explanation }}</p>
            <p v-t="'info.text'" class="info-text"></p>
          </template>
        </div>
      </inner-card>
    </generator>
  </div>
</template>

<script>
import { find } from 'lodash';
import { parse, differenceInCalendarYears } from 'date-fns';
import axios from 'axios';
import stateLoader from 'helpers/stateLoader';
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import Generator from 'components/Generator.vue';
import BlueButtonList from 'components/BlueButtonList.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import SearchField from 'components/SearchField.vue';
import StripedIconButton from 'components/StripedIconButton.vue';
import InnerCard from './InnerCard.vue';

function getAge(date) {
  if (!date) {
    return 0;
  }
  return differenceInCalendarYears(new Date(), parse(date));
}

const analysesIDs = [
  {
    id: 'demographics',
  },
  {
    id: 'presence_votes',
    round: true,
    unit: 'percent',
  },
  {
    id: 'number_of_questions',
    round: true,
    roundingPrecision: 0,
  },
  {
    id: 'speeches_per_session',
  },
  {
    id: 'spoken_words',
  },
  {
    id: 'mismatch_of_pg',
  },
];

export default {
  name: 'SeznamPoslancev',
  components: {
    Generator,
    BlueButtonList,
    InnerCard,
    PSearchDropdown,
    SearchField,
    StripedIconButton,
  },
  mixins: [
    common,
  ],
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);

    const selectedDistrictIds = loadFromState('districts') || [];
    const districts = this.$options.cardData.data.districts
      .map((district) => {
        const id = Object.keys(district)[0];
        return {
          id,
          label: district[id],
          selected: selectedDistrictIds.indexOf(id) !== -1,
        };
      });

    const genders = [
      { id: 'm', label: 'moški', selected: false },
      { id: 'f', label: 'ženski', selected: false },
    ];

    const analyses = analysesIDs.map(a => ({
      id: a.id,
      label: this.$te(`analysis-texts.${a.id}.label`) ? this.$t(`analysis-texts.${a.id}.label`) : '',
      titleSuffix: this.$te(`analysis-texts.${a.id}.titleSuffix`) ? this.$t(`analysis-texts.${a.id}.titleSuffix`) : '',
      explanation: this.$te(`analysis-texts.${a.id}.explanation`) ? this.$t(`analysis-texts.${a.id}.explanation`) : '',
    }));

    return {
      memberData: this.$options.cardData.data.data,
      currentAnalysis: loadFromState('analysis') || 'demographics',
      currentSort: loadFromState('sort') || 'name',
      currentSortOrder: loadFromState('sortOrder') || 'asc',
      currentPage: loadFromState('page') || 1,
      analyses,
      parties: [],
      selectedPartiesState: loadFromState('parties') || [],
      textFilter: loadFromState('textFilter') || '',
      districts,
      genders,
      selectedGenders: loadFromState('genders') || [],
    };
  },
  computed: {
    selectedDistrictNames() {
      return this.districts
        .filter(district => district.selected)
        .map(district => district.label);
    },
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    partiesPlaceholder() {
      return this.selectedParties.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedParties.length })
        : this.$t('select-parties-placeholder');
    },
    districtPlaceholder() {
      return this.selectedDistricts.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedDistricts.length })
        : this.$t('select-district-placeholder');
    },
    headerConfig() {
      return defaultHeaderConfig(this, {
        title: `${this.$t('card.title')} ${this.currentAnalysisData.titleSuffix}`,
      });
    },
    ogConfig() {
      return defaultOgImage(this, {
        title: `${this.$t('card.title')} ${this.currentAnalysisData.titleSuffix}`,
      });
    },
    selectedParties() {
      return this.parties
        .filter(party => party.selected);
    },
    selectedDistricts() {
      return this.districts
        .filter(district => district.selected)
        .map(district => district.id);
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
      if (this.selectedParties.length > 0) {
        parameters.parties = this.selectedParties
          .map(party => party.acronym);
      }
      if (this.selectedGenders.length > 0) {
        parameters.genders = this.selectedGenders;
      }
      if (this.selectedDistricts.length > 0) {
        parameters.districts = this.selectedDistricts;
      }
      if (this.currentPage > 1) {
        parameters.page = this.currentPage;
      }

      return parameters;
    },
    generatedCardUrl() {
      const state = `${Object.keys(this.urlParameters).length > 0 ? `&state=${encodeURIComponent(JSON.stringify(this.urlParameters))}` : ''}`;
      return `${this.url}?altHeader=true${state}`;
    },
    processedMembers() {
      let analysisMax = 0;
      if (this.currentAnalysis !== 'demographics') {
        analysisMax = this.memberData.reduce((biggest, member) => (
          Math.max(biggest, (member.results[this.currentAnalysis].score || 0))
        ), 0);
      }

      const sortedAndFiltered = this.memberData
        .filter((member) => {
          let partyMatch = true;
          let districtMatch = true;
          let genderMatch = true;
          let textMatch = true;

          if (this.textFilter.length > 0) {
            textMatch = member.person.name.toLowerCase()
              .indexOf(this.textFilter.toLowerCase()) > -1;
          }
          if (this.selectedParties.length > 0) {
            partyMatch = this.selectedParties
              .find(p => p.id === member.person.party.id) != null;
          }
          if (this.selectedDistricts.length > 0) {
            districtMatch = member.person.district.reduce((prevMatch, memberDistrict) => (
              prevMatch || this.selectedDistricts.indexOf(String(memberDistrict)) > -1
            ), false);
          }
          if (this.selectedGenders.length > 0) {
            genderMatch = this.selectedGenders.indexOf(member.person.gender) > -1;
          }

          return textMatch && partyMatch && districtMatch && genderMatch;
        })
        .map((member) => {
          const newMember = JSON.parse(JSON.stringify(member));
          if (!newMember.person.district || !newMember.person.district.length) {
            newMember.formattedDistrict = this.$t('missing-district');
          } else {
            newMember.formattedDistrict = newMember.person.district
              .map(memberDistrict => find(this.districts, { id: String(memberDistrict) }).label)
              .join(', ');
          }

          newMember.partylink = newMember.person.party.classification === 'pg';
          newMember.age = getAge(newMember.results.birth_date && newMember.results.birth_date.score) || '';
          const education = newMember.results.education && newMember.results.education.score;
          newMember.education = parseInt(education || 0, 10);
          newMember.terms = newMember.results.mandates.score || 1;
          if (this.currentAnalysis !== 'demographics') {
            const score = newMember.results[this.currentAnalysis].score || 0;
            newMember.analysisValue = Math.round(score * 10) / 10;
            newMember.analysisPercentage = (score / analysisMax) * 100;
            const diff = Math.round(newMember.results[this.currentAnalysis].diff * 10) / 10;
            newMember.analysisDiff = (diff > 0 ? '+' : '') + diff;
          }
          return newMember;
        })
        .sort((memberA, memberB) => {
          let a;
          let b;
          switch (this.currentSort) {
            case 'change':
              a = memberA.results[this.currentAnalysis].diff;
              b = memberB.results[this.currentAnalysis].diff;
              return a - b;
            case 'analysis':
              a = (memberA.results[this.currentAnalysis].score || 0);
              b = (memberB.results[this.currentAnalysis].score || 0);
              return a - b;
            case 'name':
              a = memberA.person.name;
              b = memberB.person.name;
              return a.localeCompare(b, 'sl');
            case 'district':
              a = memberA.formattedDistrict;
              b = memberB.formattedDistrict;
              return a.localeCompare(b, 'sl');
            case 'party':
              a = memberA.person.party.acronym;
              b = memberB.person.party.acronym;
              return a.localeCompare(b, 'sl');
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
        analysis: this.$t('sort-by--analysis', { analysis: this.currentAnalysisData.label }),
        change: this.$t('sort-by--change', { analysis: this.currentAnalysisData.label }),
        age: this.$t('sort-by--age'),
        education: this.$t('sort-by--education'),
        terms: this.$t('sort-by--terms'),
      };
    },
  },
  watch: {
    currentAnalysis(newValue) {
      if (newValue === 'demographics') {
        this.currentSort = 'name';
        this.currentSortOrder = 'asc';
      } else {
        this.currentSort = 'analysis';
        this.currentSortOrder = 'desc';
      }
    },
  },
  created() {
    axios.get(`${this.slugs.urls.analize}/pg/getListOfPGs/`)
      .then((response) => {
        this.parties = response.data.data.map(party => ({
          id: party.party.id,
          label: party.party.name,
          acronym: party.party.acronym,
          selected: this.selectedPartiesState.indexOf(party.party.acronym) !== -1,
          colorClass: `${party.party.acronym.toLowerCase().replace(/[ +,]/g, '_')}-background`,
        }));
      });
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
        this.currentSortOrder = this.currentSortOrder === 'desc' ? 'asc' : 'desc';
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
@import '~parlassets/scss/breakpoints';

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

  .filter.search-field {
    flex: 1.2;
  }

  .filter.genders {
    display: flex;
    flex: 0 1 auto;

    .gender {
      width: 40px;

      &:not(:last-child) {
        margin-right: 3px;
      }
    }
  }

  @include respond-to(mobile) {
    flex-wrap: wrap;

    .filter.search-field {
      flex-basis: auto;
      order: 1;
      margin-top: 5px;
    }

    .filter.parties {
      margin: 0;
    }

    .filter.district  {
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

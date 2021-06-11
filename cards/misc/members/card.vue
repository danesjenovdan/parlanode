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
                :key="gender.id"
                :color="'funblue'"
                :selected="selectedGenders.indexOf(gender.id) > -1"
                :icon="gender.icon"
                :stripe-position="'top'"
                class="gender"
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
      :demographics="currentAnalysis === 'demographics'"
      @sort="sortBy"
      @page-change="onPageChange"
    />
  </card-wrapper>
</template>

<script>
import stableSort from 'stable';
import { find, uniqBy } from 'lodash-es';
import { parseISO, differenceInCalendarYears } from 'date-fns';
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import SearchField from '@/_components/SearchField.vue';
import StripedIconButton from '@/_components/StripedIconButton.vue';
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
  name: 'CardMiscMembers',
  components: {
    BlueButtonList,
    InnerCard,
    PSearchDropdown,
    SearchField,
    StripedIconButton,
  },
  mixins: [common],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const selectedDistrictIds = this.cardState.districts || [];
    const districts = (this.cardData.districts || []).map((district) => {
      const id = Object.keys(district)[0];
      return {
        id,
        label: district[id],
        selected: selectedDistrictIds.indexOf(id) !== -1,
      };
    });

    const genders = [
      { id: 'he', icon: 'm', label: 'moški', selected: false },
      { id: 'she', icon: 'f', label: 'ženski', selected: false },
    ];

    const members = this.cardData.data?.results || [];

    const selectedParties = this.cardState.parties || [];
    const parties = uniqBy(
      members.map((m) => m.group).filter(Boolean),
      'slug'
    ).map((g) => ({
      id: g.slug,
      label: g.name,
      acronym: g.acronym,
      selected: selectedParties.includes(g.acronym),
      colorClass: `${g.acronym
        .toLowerCase()
        .replace(/[ +,]/g, '_')}-background`,
    }));

    const analyses = analysesIDs.map((a) => ({
      id: a.id,
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
      parties,
      textFilter: this.cardState.textFilter || '',
      districts,
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
      return this.selectedParties.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedParties.length })
        : this.$t('select-parties-placeholder');
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
    selectedParties() {
      return this.parties.filter((party) => party.selected);
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
      if (this.selectedParties.length > 0) {
        parameters.parties = this.selectedParties.map((party) => party.acronym);
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

    processedMembers() {
      let analysisMax = 0;
      if (this.currentAnalysis !== 'demographics') {
        analysisMax = this.members.reduce(
          (biggest, member) =>
            Math.max(
              biggest,
              member.results?.[this.currentAnalysis].score || 0
            ),
          0
        );
      }

      const lowerTextFilter = String(this.textFilter || '').toLowerCase();

      const filtered = this.members
        .filter((member) => {
          let partyMatch = true;
          let districtMatch = true;
          let genderMatch = true;
          let textMatch = true;

          if (lowerTextFilter) {
            textMatch = member.name.toLowerCase().includes(lowerTextFilter);
          }
          if (this.selectedParties.length > 0) {
            partyMatch =
              member.group?.acronym &&
              this.selectedParties.find(
                (p) => p.acronym === member.group?.acronym
              ) != null;
          }
          if (this.selectedDistricts.length > 0) {
            districtMatch = member.person.district.reduce(
              (prevMatch, memberDistrict) =>
                prevMatch ||
                this.selectedDistricts.indexOf(String(memberDistrict)) > -1,
              false
            );
          }
          if (this.selectedGenders.length > 0) {
            genderMatch = this.selectedGenders.includes(
              member.preferred_pronoun
            );
          }

          return textMatch && partyMatch && districtMatch && genderMatch;
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

          newMember.partylink = newMember.party?.classification === 'pg';
          newMember.age = getAge(newMember.date_of_birth) || '';
          const education = newMember.education_level;
          newMember.education = String(education || 0);
          newMember.terms = newMember.number_of_mandates || 1;
          if (this.currentAnalysis !== 'demographics') {
            const score = newMember.results?.[this.currentAnalysis].score || 0;
            newMember.analysisValue = Math.round(score * 10) / 10;
            newMember.analysisPercentage =
              analysisMax > 0 ? (score / analysisMax) * 100 : 0;
            const diff =
              Math.round(newMember.results?.[this.currentAnalysis].diff * 10) /
              10;
            newMember.analysisDiff = (diff > 0 ? '+' : '') + diff;
          }
          return newMember;
        });

      const sortedAndFiltered = stableSort(filtered, (memberA, memberB) => {
        let a;
        let b;
        switch (this.currentSort) {
          case 'change':
            a = memberA.results?.[this.currentAnalysis].diff;
            b = memberB.results?.[this.currentAnalysis].diff;
            return a - b;
          case 'analysis':
            a = memberA.results?.[this.currentAnalysis].score || 0;
            b = memberB.results?.[this.currentAnalysis].score || 0;
            return a - b;
          case 'name':
            a = memberA.name;
            b = memberB.name;
            return a.localeCompare(b, 'sl');
          case 'district':
            a = memberA.formattedDistrict;
            b = memberB.formattedDistrict;
            return a.localeCompare(b, 'sl');
          case 'working_bodies':
            a = (memberA.working_bodies || []).join(', ');
            b = (memberB.working_bodies || []).join(', ');
            return a.localeCompare(b, 'sl');
          case 'party':
            a = memberA.person.party.acronym;
            b = memberB.person.party.acronym;
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
      if (newValue === 'demographics') {
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

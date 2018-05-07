<template>
  <div
    v-if="$options.cardData.parlaState && $options.cardData.parlaState.generator"
    :id="$options.cardData.cardData._id">
    <div class="party-list-generator">
      <div class="row">
        <div class="col-md-12">
          <blue-button-list
            :items="analyses"
            v-model="currentAnalysis" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-12 filters">
          <div class="parties filter">
            <striped-button
              class="party"
              v-for="party in parties"
              @click.native="selectParty(party.acronym)"
              :color="party.color"
              :key="party.acronym"
              :selected="selectedParties.indexOf(party.acronym) > -1"
              :small-text="party.acronym"
              :is-uppercase="false"
              stripe-position="bottom"
            />
          </div>
          <search-field class="filter text-filter" v-model="textFilter" />
          <p-search-dropdown
            class="filter district-filter"
            :items="districts"
            :placeholder="districtPlaceholder"
          />
          <div class="genders filter">
            <striped-icon-button
              class="gender"
              v-for="gender in genders"
              :color="'funblue'"
              :key="gender.id"
              :selected="selectedGenders.indexOf(gender.id) > -1"
              :icon="gender.id"
              :stripe-position="'top'"
              @click.native="selectGender(gender.id)">
            </striped-icon-button>
          </div>

        </div>
      </div>


      <div class="row">
        <div class="col-md-12">
          <inner-card
            v-bind="{ headerConfig, generatedCardUrl, currentAnalysisData, processedMembers, currentSort, currentSortOrder, infoText }"
            :demographics="currentAnalysis === 'demographics'"
            @sort="sortBy"
          />
        </div>
      </div>
    </div>
  </div>
  <inner-card v-else
    v-bind="{ headerConfig, generatedCardUrl, currentAnalysisData, processedMembers, currentSort, currentSortOrder, infoText }"
    :demographics="currentAnalysis === 'demographics'"
    @sort="sortBy"
  />
</template>

<script>
import { find } from 'lodash';

import stateLoader from 'helpers/stateLoader';
import urlFunctionalities from 'mixins/urlFunctionalities';
import BlueButtonList from 'components/BlueButtonList.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import SearchField from 'components/SearchField.vue';
import StripedButton from 'components/StripedButton.vue';
import StripedIconButton from 'components/StripedIconButton.vue';
import analyses from './analyses.json';
import InnerCard from './InnerCard.vue';

export default {
  components: {
    BlueButtonList,
    InnerCard,
    PSearchDropdown,
    SearchField,
    StripedButton,
    StripedIconButton,
  },
  mixins: [urlFunctionalities],
  name: 'SeznamPoslancev',
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);

    const districts = this.$options.cardData.data.districts
      .map(district => ({
        id: Object.keys(district)[0],
        label: district[Object.keys(district)[0]],
        selected: false,
      }));

    const genders = [
      { id: 'm', label: 'moški', selected: false },
      { id: 'f', label: 'ženski', selected: false },
    ];

    return {
      memberData: this.$options.cardData.data.data,
      currentAnalysis: loadFromState('analysis') || 'demographics',
      currentSort: loadFromState('sort') || 'name',
      currentSortOrder: loadFromState('sortOrder') || 'asc',
      analyses,
      parties: [],
      selectedParties: loadFromState('parties') || [],
      textFilter: '',
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
    infoText() {
      const parties = this.selectedParties.length
        ? `poslanska skupina: ${this.selectedParties.join(', ')}`
        : 'vse poslanske skupine';
      const districts = this.selectedDistrictNames.length
        ? `volilni okraj: ${this.selectedDistrictNames.join(', ')}`
        : 'vsi volilni okraji';
      const firstLine = `Množica vseh trenutno aktivnih poslancev, ki ustrezajo
        uporabniškemu vnosu (${parties}; ${districts}).`;

      const sortMap = {
        name: 'abecedi',
        district: 'okrajih',
        party: 'poslanskih skupinah',
        analysis: `rezultatu analize ${this.currentAnalysisData.label}`,
        change: `aktualni spremembi v rezultatu analize ${this.currentAnalysisData.label}`,
        age: 'starosti',
        education: 'stopnji izobrazbe',
        terms: 'številu mandatov',
      };

      const secondLine = `Seznam je sortiran po ${sortMap[this.currentSort]}.`;
      const thirdLine = this.currentAnalysisData.explanation
        ? `<p class="info-text heading">METODOLOGIJA</p>
           <p class="info-text">${this.currentAnalysisData.explanation}</p>`
        : '';

      return `<p class="info-text lead">
                ${firstLine}
                ${secondLine}
              </p>
              ${thirdLine}`;
    },
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    districtPlaceholder() {
      if (this.selectedDistricts.length > 0) {
        return `Izbranih: ${this.selectedDistricts.length}`;
      }
      return 'Izberi okraj';
    },
    headerConfig() {
      return {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: `${this.$options.cardData.cardData.name} ${this.currentAnalysisData.titleSuffix}`,
      };
    },
    selectedDistricts() {
      return this.districts
        .filter(district => district.selected)
        .map(district => district.id);
    },
    urlParameters() {
      const parameters = {};

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
        parameters.parties = this.selectedParties;
      }
      if (this.selectedGenders.length > 0) {
        parameters.genders = this.selectedGenders;
      }

      return parameters;
    },
    processedMembers() {
      let analysisMax = 0;
      if (this.currentAnalysis !== 'demographics') {
        analysisMax = this.memberData.reduce(
          (biggest, member) =>
            Math.max(biggest, (member.results[this.currentAnalysis].score || 0)),
          0,
        );
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
            partyMatch = this.selectedParties.indexOf(member.person.party.acronym) > -1;
          }
          if (this.selectedDistricts.length > 0) {
            districtMatch = member.person.district.reduce(
              (prevMatch, memberDistrict) =>
                prevMatch || this.selectedDistricts.indexOf(String(memberDistrict)) > -1,
              false,
            );
          }
          if (this.selectedGenders.length > 0) {
            genderMatch = this.selectedGenders.indexOf(member.person.gender) > -1;
          }

          return textMatch && partyMatch && districtMatch && genderMatch;
        })
        .map((member) => {
          const newMember = JSON.parse(JSON.stringify(member));
          if (newMember.person.district.length === 0) {
            newMember.formattedDistrict = 'okraj ni vnešen';
          } else {
            newMember.formattedDistrict = newMember.person.district
              .map(memberDistrict =>
                find(this.districts, { id: String(memberDistrict) }).label)
              .join(', ');
          }

          newMember.partylink = newMember.person.party.acronym.indexOf('NeP') === -1;
          newMember.age = (newMember.results.age && newMember.results.age.score) || '';
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
              return a.localeCompare(b);
            case 'district':
              a = memberA.formattedDistrict;
              b = memberB.formattedDistrict;
              return a.localeCompare(b);
            case 'party':
              a = memberA.person.party.acronym;
              b = memberB.person.party.acronym;
              return a.localeCompare(b);
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
  },
  methods: {
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },
    selectParty(id) {
      const position = this.selectedParties.indexOf(id);
      if (position > -1) {
        this.selectedParties.splice(position, 1);
      } else {
        this.selectedParties.push(id);
      }
    },
    selectGender(id) {
      const position = this.selectedGenders.indexOf(id);
      if (position > -1) {
        this.selectedGenders.splice(position, 1);
      } else {
        this.selectedGenders.push(id);
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
    const that = this;
    $.getJSON('https://analize.parlameter.si/v1/pg/getListOfPGs/', (response) => {
      that.parties = response.data.map(party => ({
        acronym: party.party.acronym,
        color: party.party.acronym.toLowerCase().replace(/ /g, '_'),
      }));
    });
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

  .filter {
    margin-left: 3px;
    flex: 1;
  }
  .text-filter {
    &.search-field {
      height: 58px;
    }
  }
  .parties {
    display: flex;
    flex: 3;
    .party {
      flex: 1;
      &:not(:last-child) { margin-right: 3px; }
    }
  }
  .genders {
    display: flex;
    flex: 0;
    .gender {
      width: 40px;
      &:not(:last-child) {
        margin-right: 3px;
      }
    }
  }

  @include respond-to(mobile) {
    flex-wrap: wrap;

    .parties {
      flex: 1 1 100%;

      .party {
        margin-bottom: 10px;
      }
    }

    .district-filter  {
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

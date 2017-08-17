<template>
  <div v-if="$options.cardData.state.generator" :id="$options.cardData.cardData._id">
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
          <search-dropdown
            class="filter district-filter"
            :items="districts"
            :placeholder="districtPlaceholder"
          />
          <search-dropdown
            class="filter gender-filter"
            :items="genders"
            :placeholder="genderPlaceholder"
          />
        </div>
      </div>


      <div class="row">
        <div class="col-md-12">
          <inner-card
            v-bind="{ headerConfig, generatedCardUrl, currentAnalysisData, processedMembers, currentSort, currentSortOrder }"
            :demographics="currentAnalysis === 'demographics'"
            @sort="sortBy"
          />
        </div>
      </div>
    </div>
  </div>
  <inner-card v-else
    v-bind="{ headerConfig, generatedCardUrl, currentAnalysisData, processedMembers, currentSort, currentSortOrder }"
    :demographics="currentAnalysis === 'demographics'"
    @sort="sortBy"
  />
</template>

<script>
/* globals measure $ */
import { find } from 'lodash';

import stateLoader from 'helpers/stateLoader';
import urlFunctionalities from 'mixins/urlFunctionalities';
import BlueButtonList from 'components/BlueButtonList.vue';
import SearchField from 'components/SearchField.vue';
import StripedButton from 'components/StripedButton.vue';
import analyses from './analyses.json';
import InnerCard from './InnerCard.vue';

export default {
  components: { BlueButtonList, InnerCard, SearchField, StripedButton },
  mixins: [urlFunctionalities],
  name: 'SeznamPoslancev',
  data() {
    const loadFromState = stateLoader(this.$options.cardData.state);

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
      currentSort: 'name',
      currentSortOrder: 'asc',
      analyses,
      parties: [],
      selectedParties: [],
      textFilter: '',
      districts,
      genders,
    };
  },
  computed: {
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    districtPlaceholder() {
      if (this.selectedDistricts.length > 0) {
        return `Izbranih: ${this.selectedDistricts.length}`;
      }
      return 'Izberi okraj';
    },
    genderPlaceholder() {
      if (this.selectedGenders.length > 0) {
        return `Izbranih: ${this.selectedGenders.length}`;
      }
      return 'Izberi spol';
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
    selectedGenders() {
      return this.genders
        .filter(gender => gender.selected)
        .map(gender => gender.id);
    },
    urlParameters() {
      const parameters = {};
      if (this.currentAnalysis !== 'demographics') {
        parameters.analysis = this.currentAnalysis;
      }
      return parameters;
    },
    processedMembers() {
      let analysisMax = 0;
      if (this.currentAnalysis !== 'demographics') {
        analysisMax = this.memberData.reduce((biggest, member) =>
          Math.max(biggest, member.results[this.currentAnalysis].score),
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
            textMatch = member.person.name.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
          }
          if (this.selectedParties.length > 0) {
            partyMatch = this.selectedParties.indexOf(member.person.party.acronym) > -1;
          }
          if (this.selectedDistricts.length > 0) {
            districtMatch = member.person.district.reduce((prevMatch, memberDistrict) =>
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
            newMember.formattedDistrict = newMember.person.district.map(memberDistrict =>
              this.districts.filter(district =>
                district.id === String(memberDistrict),
              )[0].label,
            ).join(', ');
          }

          newMember.partylink = newMember.person.party.acronym.indexOf('NeP') === -1;
          newMember.age = Math.floor(Math.random() * 50) + 18;
          newMember.education = Math.ceil(Math.random() * 5) + 3;
          newMember.terms = Math.ceil(Math.random() * 3);
          if (this.currentAnalysis !== 'demographics') {
            newMember.analysisValue = Math.round(newMember.results[this.currentAnalysis].score * 10) / 10;
            newMember.analysisPercentage = newMember.results[this.currentAnalysis].score / analysisMax * 100;
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
              return a < b ? -1 : (a > b ? 1 : 0);
            case 'analysis':
              a = memberA.results[this.currentAnalysis].score;
              b = memberB.results[this.currentAnalysis].score;
              return a < b ? -1 : (a > b ? 1 : 0);
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
              return a < b ? -1 : (a > b ? 1 : 0);
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
    currentAnalysis(newValue, oldValue) {
      if (newValue === 'demographics' || oldValue === 'demographics') {
        this.currentSort = 'name';
        this.currentSortOrder = 'asc';
      }
    },
  },
  created() {
    $.get('https://analize.parlameter.si/v1/pg/getListOfPGs/')
      .then((response) => {
        this.parties = response.data.map(party => ({
          acronym: party.party.acronym,
          color: party.party.acronym.toLowerCase().replace(/ /g, '_'),
        }));
      })
      .fail(() => {
        throw new Error('Could not fetch parties.');
      });
  },
};
</script>

<style lang="scss" scoped>
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
    .party {
      flex: 1;
      &:not(:last-child) { margin-right: 3px; }
    }
  }
}
</style>

<style>
.person-list .headers .column {
  white-space: normal;
}
</style>

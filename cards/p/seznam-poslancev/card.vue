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
          <inner-card v-bind="{ headerConfig, generatedCardUrl, currentAnalysisData, columns, processedMembers }" />
        </div>
      </div>
    </div>
  </div>
  <inner-card v-else v-bind="{ headerConfig, generatedCardUrl, currentAnalysisData, columns, processedMembers }" />
</template>

<script>
/* globals measure $ */
import { find } from 'lodash';
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
      currentAnalysis: this.$options.cardData.state.analysis || 'demographics',
      analyses,
      parties: [],
      selectedParties: [],
      textFilter: '',
      districts,
      genders,
      columns: [
        { id: 'image', label: '', additionalClass: 'portrait' },
        { id: 'name', label: 'Ime', additionalClass: 'wider name' },
        { id: 'age', label: 'Starost' },
        { id: 'education', label: 'Stopnja izobrazbe', additionalClass: 'optional' },
        { id: 'terms', label: 'Število mandatov', additionalClass: 'optional' },
        { id: 'party', label: 'PS', additionalClass: 'optional' },
        { id: 'district', label: 'Okraj', additionalClass: 'optional' },
      ],
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
            districtMatch = member.person.district.reduce((prevMatch, memberDistrict) => {
              return prevMatch || this.selectedDistricts.indexOf(String(memberDistrict)) > -1
            }, false);
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
          newMember.education = 'VII';
          newMember.terms = Math.ceil(Math.random() * 3);
          return newMember;
        });
        // .sort(function(memberA, memberB) {
        //   switch (that.currentSort) {
        //     case 'change':
        //       var a = memberA.results[that.currentAnalysis].diff
        //       var b = memberB.results[that.currentAnalysis].diff
        //       return a < b ? -1 : (a > b ? 1 : 0)
        //     case 'analysis':
        //       var a = memberA.results[that.currentAnalysis].score
        //       var b = memberB.results[that.currentAnalysis].score
        //       return a < b ? -1 : (a > b ? 1 : 0)
        //     case 'name':
        //       var a = memberA.person.name
        //       var b = memberB.person.name
        //       return a.localeCompare(b, 'sl')
        //     case 'district':
        //       var a = memberA.person.formattedDistrict
        //       var b = memberB.person.formattedDistrict
        //       return a.localeCompare(b, 'sl')
        //     case 'party':
        //       var a = memberA.person.party.acronym
        //       var b = memberB.person.party.acronym
        //       return a.localeCompare(b, 'sl')
        //     default:
        //       break
        //   }
        // })

      // if (this.currentSortOrder === 'desc') {
      //   sortedAndFiltered.reverse()
      // }

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

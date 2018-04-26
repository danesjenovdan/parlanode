<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
    content-class="full card-scroll"
    :card-url="cardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Pregled vseh glasovanj, ki so se zgodila na seji.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Za vsa glasovanja na posamezni seji preštejemo vse glasove (ZA, PROTI, VZDRŽAN/-A) in število poslancev, ki niso glasovali, ter izpišemo rezultate.</p>
      <p class="info-text">Nabor glasovanj pridobimo s spletnega mesta <a href="https://www.dz-rs.si/wps/portal/Home/deloDZ/seje/sejeDrzavnegaZbora/PoDatumuSeje" target="_blank" class="funblue-light-hover">DZ RS</a>.</p>
    </div>

    <div v-show="false" class="card-content__empty"> <!-- TODO this is hardcoded -->
      <div class="card-content__empty-inner">
        <img src="//cdn.parlameter.si/v1/parlassets/img/icons/no-data.svg" />
        <p>Podatki trenutno niso na voljo.</p>
      </div>
    </div>
    <div :class="{ 'filters': true, 'filters--shadow': card.shouldShadow }">
      <div class="filter text-filter">
        <div class="filter-label">Išči po naslovu glasovanja</div>
        <p-search-field v-model="textFilter" />
      </div>
      <div class="filter type-dropdown">
        <div class="filter-label">Tipi glasovanja</div>
        <p-search-dropdown :items="dropdownItems.classifications" :placeholder="classificationPlaceholder" :alphabetise="false" />
      </div>
      <div class="filter tag-dropdown">
        <div class="filter-label">Matično delovno telo</div>
        <p-search-dropdown :items="dropdownItems.tags" :placeholder="tagPlaceholder" />
      </div>
      <div v-if="this.type==='person'" class="filter option-party-buttons">
        <div v-for="option in allOptions"
        :class="['party-button', option.class, { selected: selectedOptions.indexOf(option.id) > -1 }]"
        @click="toggleOption(option.id)">{{ option.label }}</div>
      </div>
      <div v-if="this.type==='party'" class="filter text-filter">
        <div class="filter-label">Razvrsti po</div>
        <toggle v-model="selectedSort" :options="sortOptions" />
      </div>
    </div>

    <div id="card-votes" class="votes stickinme date-list card-scroll__wrapper">
      <template v-for="votingDay in filteredVotingDays">
        <div v-if="type === 'person' || selectedSort === 'date'" class="date">{{ votingDay.date }}</div>
        <div>
          <div v-for="ballot in votingDay.ballots">
            <ballot :ballot="ballot" type="person"></ballot>
          </div>
        </div>
      </template>
    </div>
  </card-wrapper>
</template>

<script>
import { capitalize } from 'lodash';
import PSearchField from 'components/SearchField.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import DateRow from 'components/DateRow.vue';
import Toggle from 'components/Toggle.vue';
import Ballot from 'components/Ballot.vue';

import common from 'mixins/common';
import scroll from 'mixins/scroll';

import { memberVotes, partyVotes } from 'mixins/contextUrls';
import { memberTitle, partyTitle } from 'mixins/titles';

export default {
  components: { PSearchDropdown, PSearchField, DateRow, Toggle, Ballot },
  mixins: [common, scroll],
  computed: {
    tagPlaceholder() {
      return this.selectedTags.length > 0 ? `Izbranih: ${this.selectedTags.length}` : 'Izberi';
    },
    // monthPlaceholder() {
    //   return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
    // },
    classificationPlaceholder() {
      return this.selectedClassifications.length > 0 ? `Izbranih: ${this.selectedClassifications.length}` : 'Izberi';
    },
    dropdownItems() {
      const validTags = [];

      this.getFilteredVotingDays(true).forEach((votingDay) => {
        // const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));
        // const monthId = `${year}-${month}`;
        // if (validMonths.indexOf(monthId) === -1) validMonths.push(monthId);
        votingDay.ballots
          .forEach((ballot) => {
            ballot.tags.forEach((tag) => {
              if (validTags.indexOf(tag) === -1) validTags.push(tag);
            });
          });
      });

      return {
        tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
        classifications: this.allClassifications,
        // months: this.allMonths.filter(month => validMonths.indexOf(month.id) > -1),
      };
    },
    selectedTags() {
      return this.allTags
        .filter(tag => tag.selected)
        .map(tag => tag.id);
    },
    selectedClassifications() {
      return this.allClassifications
        .filter(classification => classification.selected)
        .map(classification => classification.id);
    },
    // selectedMonths() {
    //   return this.allMonths.filter(month => month.selected);
    // },
    selectedOptions() {
      return this.allOptions.filter(option => option.selected).map(option => option.id);
    },
    filteredVotingDays() {
      return this.getFilteredVotingDays();
    },
    cardUrl() {
      const state = {};

      if (this.selectedTags.length > 0) state.tags = this.selectedTags;
      // if (this.selectedMonths.length > 0) state.months = this.selectedMonths.map(month => month.id);
      if (this.selectedClassifications.length > 0) state.classifications = this.selectedClassifications;
      if (this.textFilter.length > 0) state.text = this.textFilter;
      if (this.selectedOptions.length > 0) state.options = this.selectedOptions;

      return `https://glej.parlameter.si/${this.cardGroup}/${this.cardMethod}/${this[this.type].id}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    headerConfig() {
      let specifics;
      if (this.type === 'person') {
        specifics = {
          heading: this.person.name,
          subheading: `${this.person.party.acronym} | ${this.person.party.is_coalition ? 'koalicija' : 'opozicija'}`,
          circleImage: this.person.gov_id,
        };
      } else {
        specifics = {
          heading: this.party.name,
          subheading: `${this.party.acronym} | ${this.party.is_coalition ? 'koalicija' : 'opozicija'}`,
          circleText: this.party.acronym,
          circleClass: `${this.party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
        };
      }

      return Object.assign({}, specifics, {
        alternative: JSON.parse(this.cardData.cardData.altHeader || 'false'),
        title: this.cardData.cardData.name,
      });
    },
  },
  data() {
    const selectFromState = (items, stateItemIds) =>
      items.map(item => Object.assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }));

    // let allMonths = generateMonths();

    let allOptions = [
      { id: 'za', class: 'for', label: 'ZA', selected: false },
      { id: 'proti', class: 'against', label: 'PROTI', selected: false },
      { id: 'kvorum', class: 'kvorum', label: (this.type === 'person' ? 'VZDRŽAN' : 'VZDRŽANI'), selected: false },
      { id: 'ni', class: 'ni', label: (this.type === 'person' ? 'NI' : 'NISO'), selected: false },
    ];

    let allTags = this.cardData.data.all_tags
      .map(tag => ({ id: tag, label: tag, selected: false }));

    let allClassifications = [];
    for (var classificationKey in this.cardData.data.classifications) {
      allClassifications.push({ id: classificationKey, label: this.cardData.data.classifications[classificationKey], selected: false });
    }

    let textFilter = '';

    if (this.cardData.parlaState) {
      const state = this.cardData.parlaState;
      if (state.text) textFilter = state.text;

      if (state.classifications) allClassifications = selectFromState(allClassifications, state.classifications);
      if (state.options) allOptions = selectFromState(allOptions, state.options);
      if (state.tags) allTags = selectFromState(allTags, state.tags);
    }

    return {
      cardMethod: this.cardData.cardData.method,
      cardGroup: this.cardData.cardData.group,
      votingDays: this.cardData.data.results,
      selectedSort: 'date',
      sortOptions: { maximum: 'Neenotnosti', date: 'Datumu' },
      // allMonths,
      allClassifications,
      allOptions,
      allTags,
      textFilter,

    };
  },
  mounted() {
    this.card.shadowElement = 'card-votes';
    if (document) {
      document.getElementById(this.card.shadowElement).addEventListener('scroll', this.checkScrollPosition);
    }
  },
  methods: {
    toggleOption(optionId) {
      const clickedOption = this.allOptions.filter(option => option.id === optionId)[0];
      clickedOption.selected = !clickedOption.selected;
    },
    getFilteredVotingDays(onlyFilterByText = false) {
      const filterBallots = (ballot) => {
        const tagMatch = onlyFilterByText || this.selectedTags.length === 0 ||
          ballot.tags.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const textMatch = this.textFilter === '' ||
          ballot.motion.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;
        const optionMatch = onlyFilterByText || this.selectedOptions.length === 0 ||
          this.selectedOptions.indexOf(ballot.option) > -1;
        const classificationMatch = onlyFilterByText || this.selectedClassifications.length === 0 ||
          this.selectedClassifications.indexOf(ballot.classification) > -1;

        return tagMatch && textMatch && optionMatch && classificationMatch;
      };

      // const filterDates = (votingDay) => {
      //   // if (onlyFilterByText || this.selectedMonths.length === 0) return true;
      //   if (onlyFilterByText || this.selectedMonths.length === 0) return true;
      //
      //   const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));
      //
      //   return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
      // };

      const votingDays = this.votingDays
        .map(votingDay => ({
          date: votingDay.date,
          ballots: votingDay.ballots
            .filter(filterBallots)
            .map((ballot) => {
              const ballotClone = JSON.parse(JSON.stringify(ballot));
              if (ballot.option === 'ni') {
                ballotClone.label = this.type === 'person'
                  ? `Ni ${this.vocabulary.glasovati[this.person.gender]} o`
                  : 'Niso glasovali o';
              } else {
                ballotClone.label = this.type === 'person'
                  ? `${capitalize(this.vocabulary.glasovati[this.person.gender])} ${ballot.option.toUpperCase()}`
                  : `Glasovali ${ballot.option.toUpperCase()}`;
              }

              if (ballot.result !== 'none') {
                ballotClone.outcome = ballot.result === true ? 'Sprejet' : 'Zavrnjen';
              }

              return ballotClone;
            }),
        }))
        .filter(votingDay => votingDay.ballots.length > 0);
        // .filter(filterDates);

      if (this.type === 'party' && this.selectedSort === 'maximum') {
        const sortyByDisunion = (arr) => {
          let bag = [];
          let i = 0;
          while (i < arr.length) {
            bag = bag.concat(arr[i].ballots);
            i++;
          }
          return bag.sort((a, b) => {
            return parseInt(b.disunion, 10) - parseInt(a.disunion, 10);
          });
        };

        return [{
          ballots: sortyByDisunion(votingDays),
        }];
      }

      return votingDays;
    },
  },
  filters: {
    toPercent(val) {
      return parseInt(val, 10) + ' %';
    },
  },
  props: {
    cardData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: value => ['person', 'party'].indexOf(value) > -1,
    },
    person: Object,
    party: Object,
  },
  created() {
    (this.type === 'person' ? memberVotes : partyVotes).created.call(this);
    (this.type === 'person' ? memberTitle : partyTitle).created.call(this);
  },
};
</script>

<style lang="scss" scoped>
  @import '~parlassets/scss/breakpoints';
  @import '~parlassets/scss/colors';

  .toggle {
    height: 51px !important;
    line-height: 51px !important;
  }

  .card-content-front {
    display: flex;
    flex-direction: column;
  }

  .filters {
    @include respond-to(mobile) {
      flex-wrap: wrap;
      min-height: 154px;
    }
    $label-height: 26px;

    .option-party-buttons {
      @include show-for(desktop, flex);

      width: 27.5%;
      padding-top: $label-height;

      .party-button:not(:last-child) {
        margin-right: 3px;
      }
    }

    .text-filter {
      @include respond-to(desktop) { width: 26%; }

      width: 100%;

      .text-filter-input {
        background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/search.svg');
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: right 9px center;
        border: 1px solid #c8c8c8;
        font-size: 16px;
        height: 51px;
        line-height: 27px;
        outline: none;
        padding: 12px 42px 12px 14px;
        width: 100%;
      }
    }

    .tag-dropdown {
      @include respond-to(desktop) { width: 26%; }

      width: 100%;
    }

    .month-dropdown {
      @include show-for(desktop);

      width: 17.5%;
    }
  }

  .votes {
    flex: 1;
    // list-style: none;
    overflow-y: auto;
    position: relative;

    &:empty::after {
      color: #c8c8c8;
      content: "Ni rezultatov.";
      left: calc(50% - 41px);
      position: absolute;
      top: calc(50% - 10px);
    }

    ul {
      list-style: none;
      margin: 0 0 7px;
      padding: 0;
    }

    li {
      display: flex;
      font-weight: 500;
      font-size: 16px;
      line-height: 18px;

      .date {
        height: auto;
        margin: 0 0 -18px 16px;
        padding: 16px 0;
        width: 54px;
      }
    }
  }

  .filters {
    .filter {
      @include respond-to(desktop) {
        margin-right: 10px;
      }

      @include respond-to(mobile) {
        width: 100%;
      }

      &:last-child {
        margin-right: 0;
      }
    }

    .filter-label {
      overflow: hidden;
      height: 26px;
    }
  }

</style>

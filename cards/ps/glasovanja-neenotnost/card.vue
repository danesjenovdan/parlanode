<template>
  <div class="card-container card-halfling card-glasovanja-neenotnost" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div class="groups">
          <striped-button
            v-for="group in groups"
            @click.native="selectGroup(group.acronym)"
            :color="group.color.toLowercase()"
            :key="group.acronym"
            :selected="group.acronym === selectedGroup"
            :small-text="group.name"
            :is-uppercase="false"
          />
        </div>

        <div class="filters">
          <div class="filter text-filter">
            <div class="filter-label">Išči po naslovu glasovanja</div>
            <input class="text-filter-input" type="text" v-model="textFilter">
          </div>
          <div class="filter tag-dropdown">
            <div class="filter-label">Matično delovno telo</div>
            <search-dropdown :items="dropdownItems.tags" :placeholder="tagPlaceholder"></search-dropdown>
          </div>
          <div class="filter month-dropdown">
            <div class="filter-label">Časovno obdobje</div>
            <search-dropdown :items="dropdownItems.months" :placeholder="monthPlaceholder" :alphabetise="false"></search-dropdown>
          </div>
          <div class="filter text-filter">
            <div class="filter-label">Razvrsti po</div>
            <toggle v-model="selectedSort" :options="sortOptions" />
          </div>
        </div>

        <div :class="['results', {'is-loading': loading }]">
          <template v-for="day in filteredVotingDays">
            <date-row v-if="selectedSort === 'date'" :date="day.date" />
            <a target="_blank" :href="'https://glej.parlameter.si/s/glasovanje/' + ballot.id_parladata + '?frame=true'" v-for="ballot in day.ballots" class="ballot">
              <div class="disunion">
                <div class="percentage">{{ Math.round(ballot.maximum) }} %</div>
                <div class="text">neenotnost</div>
              </div>
              <div class="name">{{ ballot.text }}</div>
              <div class="result">
                <template v-if="ballot.result">
                  <i class="accepted glyphicon glyphicon-ok"></i>
                  <div class="text">sprejet</div>
                </template>
                <template v-else>
                  <i class="not-accepted glyphicon glyphicon-remove"></i>
                  <div class="text">zavrnjen</div>
                </template>
              </div>
            </a>
          </template>
        </div>
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text">Seznam vseh glasovanj, ki so se zgodila v tekočem sklicu DZ in so bila objavljena na spletnem mestu dz-rs.si ter ustrezajo uporabniškemu vnosu.</p>
        <p class="info-text">Rezultati so razvrščeni bodisi po neenotnosti izbrane organizacije bodisi po datumu. </p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="generatedCardUrl" />
    </div>
    <card-footer />
  </div>
</template>

<script>
/* globals window $ measure */
import { parse as parseDate, format } from 'date-fns';
import { groupBy, sortBy, zipObject, find } from 'lodash';
import { MONTH_NAMES } from 'components/constants';
import DateRow from 'components/DateRow.vue';
import StripedButton from 'components/StripedButton.vue';
import Toggle from 'components/Toggle.vue';
import common from 'mixins/common';

export default {
  components: { DateRow, StripedButton, Toggle },
  mixins: [common],
  name: 'GlasovanjaNeenotnost',
  data() {
    let groups = [{
      id: 95,
      color: 'dz',
      acronym: 'DZ',
      name: 'Vsi',
    }, {
      id: 144,
      color: 'koal',
      acronym: 'koal',
      name: 'Koalicija',
    }];

    let namedGroups = [];
    Object.keys(this.$options.cardData.data).forEach((groupName) => {
      const groupValue = this.$options.cardData.data[groupName];
      if (!groupValue.disbanded) {
        namedGroups.push({
          id: groupName,
          acronym: groupValue.acronym,
          color: groupValue.acronym.toLowerCase().replace(/ /g, '_'),
          name: groupValue.acronym,
        });
      }
    });

    namedGroups = sortBy(namedGroups, 'name');
    groups = groups.concat(namedGroups);

    return {
      voteData: [],
      loading: true,
      selectedSort: 'maximum',
      sortOptions: { maximum: 'Neenotnosti', date: 'Datumu' },
      textFilter: '',
      allTags: [],
      allMonths: [2017, 2016, 2015, 2014, 2013]
        .map(year =>
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
            ({ id: `${year}-${month}`, label: `${MONTH_NAMES[month - 1]} ${year}`, month, year, selected: false }),
          ),
        )
        .reduce((sum, element) => sum.concat(element), []),
      selectedGroup: 'DZ',
      groups,
      cardData: this.$options.cardData,
    };
  },
  computed: {
    tagPlaceholder() {
      return this.selectedTags.length > 0 ? `Izbranih: ${this.selectedTags.length}` : 'Izberi';
    },
    monthPlaceholder() {
      return this.selectedMonths.length > 0 ? `Izbranih: ${this.selectedMonths.length}` : 'Izberi';
    },
    dropdownItems() {
      const validTags = [];
      const validMonths = [];

      this.getFilteredVotingDays().forEach((votingDay) => {
        const year = votingDay.date.split(' ')[2].split('-')[0];
        const month = votingDay.date.split(' ')[1].split('.')[0];
        const monthId = `${year}-${month}`;
        if (validMonths.indexOf(monthId) === -1) validMonths.push(monthId);

        votingDay.ballots
          .forEach((ballot) => {
            ballot.tag.forEach((tag) => {
              if (validTags.indexOf(tag) === -1) validTags.push(tag);
            });
          });
      });

      return {
        tags: this.allTags.filter(tag => validTags.indexOf(tag.id) > -1),
        months: this.allMonths.filter(month => validMonths.indexOf(month.id) > -1),
      };
    },
    selectedTags() {
      return this.allTags
        .filter(tag => tag.selected)
        .map(tag => tag.id);
    },
    selectedMonths() {
      return this.allMonths.filter(month => month.selected);
    },
    filteredVotingDays() {
      return this.getFilteredVotingDays();
    },
    headerConfig() {
      return {
        circleIcon: 'seznam-glasovanj',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.dynamicTitle,
      };
    },
    dynamicTitle() {
      return this.$options.cardData.cardData.name +
        (this.selectedSort === 'date' ? 'datumu' : 'neenotnosti');
    },
    generatedCardUrl() {
      const state = {};

      if (this.selectedTags.length > 0) state.tags = this.selectedTags;
      if (this.selectedMonths.length > 0) state.months = this.selectedMonths.map(month => month.id);
      if (this.textFilter.length > 0) state.text = this.textFilter;
      if (this.selectedSort.length > 0) state.sort = this.selectedSort;
      if (this.selectedGroup.length > 0) state.selectedGroup = this.selectedGroup;

      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
  },
  methods: {
    getFilteredVotingDays(onlyFilterByText = false) {
      if (!this.voteData || this.voteData.length === 0) return [];

      const filterBallots = (ballot) => {
        const tagMatch = onlyFilterByText || this.selectedTags.length === 0 ||
          ballot.tag.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const textMatch = this.textFilter === '' ||
          ballot.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;

        return tagMatch && textMatch;
      };

      const filterDates = (votingDay) => {
        if (onlyFilterByText || this.selectedMonths.length === 0) return true;

        const year = parseInt(votingDay.date.split(' ')[2].split('-')[0], 10);
        const month = parseInt(votingDay.date.split(' ')[1].split('.')[0], 10);

        console.log(this.selectedMonths);

        return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
      };

      const votes = sortBy(this.voteData, this.selectedSort).reverse();
      const getDateFromVote = vote => {
        return (vote.date ? format(parseDate(vote.date), 'D. M. YYYY') : null);
      }

      let currentVotingDays;

      if (this.selectedSort === 'date') {
        currentVotingDays = groupBy(votes, getDateFromVote);
      } else {
        currentVotingDays = zipObject(votes.map((vote, index) => `${getDateFromVote(vote)}-${index}`), votes.map(vote => [vote]));
      }

      const mappedVotingDays = [];
      Object.keys(currentVotingDays).forEach((key) => {
        mappedVotingDays.push({
          date: key,
          ballots: currentVotingDays[key].filter(filterBallots),
        });
      });

      return mappedVotingDays
        .filter(votingDay => (votingDay.ballots.length > 0))
        .filter(filterDates);
    },
    selectGroup(acronym) {
      this.selectedGroup = this.selectedGroup !== acronym ? acronym : 'DZ';
    },
    fetchVotesForGroup(acronym = 'DZ') {
      this.loading = true;
      const groupId = find(this.groups, { acronym }).id;
      $.get(`https://analize.parlameter.si/v1/pg/getIntraDisunionOrg/${groupId}`, (response) => {
        if (this.allTags.length === 0) {
          this.allTags = response.all_tags.map(
            tag => ({ id: tag, label: tag, selected: false }),
          );
        }
        this.voteData = response[acronym];

        const selectFromState = (items, stateItemIds) =>
          items.map(item =>
            Object.assign({}, item, { selected: stateItemIds.indexOf(item.id) > -1 }),
          );

        if (this.cardData.state) {
          const state = this.cardData.state;
          if (state.text) this.textFilter = state.text;
          if (state.months) this.allMonths = selectFromState(this.allMonths, state.months);
          if (state.sort) this.selectedSort = state.sort;
          if (state.tags) this.allTags = selectFromState(this.allTags, state.tags);
          if (state.selectedGroup) this.selectedGroup = state.selectedGroup;
        }

        this.loading = false;
      });
    },
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },
  },
  watch: {
    selectedGroup(newValue) {
      this.fetchVotesForGroup(newValue);
    },
  },
  beforeMount() {
    this.fetchVotesForGroup();
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.groups {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-bottom: 16px;

  .striped-button {
    width: calc(33.33% - 3.33px);
    margin-bottom: 5px;
    @include respond-to(desktop) {
      flex: 1;
      margin-bottom: 0;
      &:not(:first-child) { margin-left: 5px; }
    }
  }
}

.filters {
  @include respond-to(mobile) {
    flex-wrap: wrap;
    min-height: 154px;
  }
  $label-height: 26px;

  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;

  .filter-label {
    font-size: 14px;
    font-weight: 300;
    line-height: $label-height;
  }

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

  .search-dropdown-input {
    padding-top: 11px;
    padding-bottom: 11px;
  }

  .search-dropdown-options { top: 50px; }
}

.results {
  height: 350px;
  overflow-y: auto;

  &.is-loading {
    overflow-y: hidden;
    position: relative;
    &::before {
      background: $white url(https://cdn.parlameter.si/v1/parlassets/img/loader.gif) no-repeat center center;
      content: '';
      height: 100%;
      position: absolute;
      width: 100%;
      z-index: 1;
    }
  }
}

  .date-row {
    &:not(:first-child) { margin-top: 20px; }
  }

  .ballot {
    $section-border: 1px solid $black;
    background: $grey;
    color: $black;
    display: block;
    margin: 7px 0 8px 0;
    min-height: 90px;
    padding: 10px 14px;
    position: relative;

    &:hover, &:active, &:focus { text-decoration: none; }

    @include respond-to(desktop) {
      display: flex;
      margin: 10px 0;
      &:first-child {
        margin-top: 0;
      }
    }

    .disunion {
      display: flex;
      justify-content: center;
      text-align: center;

      @include respond-to(desktop) {
        flex-direction: column;
        padding-right: 16px;
      }
      .percentage {
        font-size: 24px;
        @include respond-to(desktop) {
          font-size: 30px;
        }
      }

      .text {
        font-size: 13px;
        line-height: 34px;
        margin-left: 10px;
        text-transform: uppercase;
        @include respond-to(desktop) {
          font-size: 16px;
          line-height: 23px;
          margin-left: 0;
        }
      }
    }

    .name {
      border-bottom: $section-border;
      border-top: $section-border;
      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 11px;
      font-weight: 300;
      line-height: 1.45em;
      padding: 10px 0;

      @include respond-to(desktop) {
        border-bottom: none;
        border-top: none;
        border-left: $section-border;
        align-items: center;
        display: flex;
        flex: 4;
        font-size: 14px;
        padding: 5px 20px;
      }
    }

    .result {
      align-items: center;
      display: flex;
      justify-content: center;
      padding: 10px 0 0 0;

      @include respond-to(desktop) {
        border-left: $section-border;
        justify-content: left;
        padding: 0 0 0 16px;
        width: 136px;
      }

      .glyphicon {
        font-size: 24px;
        margin-bottom: 4px;
        &.accepted { color: $funblue; }
        &.not-accepted { color: $red; }

        @include respond-to(desktop) { font-size: 29px; }
      }

      .text {
        color: #333;
        font-size: 14px;
        font-weight: bold;
        text-transform: uppercase;
        margin-left: 12px;
      }
    }
  }
</style>

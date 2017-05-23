<template>
  <div class="card-container card-halfling card-glasovanja-neenotnost" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <div class="groups">
          <striped-button
            color="dz"
            :selected="selectedGroup === 'DZ'"
            small-text="Vsi"
            :click-handler="() => selectGroup('DZ')"
          />
          <striped-button
            v-for="group in groups"
            :color="group.color"
            :key="group.acronym"
            :selected="group.acronym === selectedGroup"
            :small-text="group.name"
            :click-handler="() => selectGroup(group.acronym)"
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
            <toggle :selected="selectedSort" :options="sortOptions" :click-handler="selectSort" />
          </div>
        </div>

        <div class="results">
          <template v-for="day in filteredVotingDays">
            <date-row v-if="selectedSort === 'date'" :date="day.date" />
            <div v-for="ballot in day.ballots" class="ballot">
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
            </div>
          </template>
        </div>
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="url" />

      <card-share :url="shortenedCardUrl" />
    </div>
    <card-footer :link="slugs.base" />
  </div>
</template>

<script>
/* globals window $ measure */
import { groupBy, map, sortBy, zipObject } from 'lodash';
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
    return {
      data: this.$options.cardData.data,
      slugs: this.$options.cardData.urlsData,
      shortenedCardUrl: '',
      selectedSort: 'date',
      sortOptions: [
        { label: 'Datumu', id: 'date' },
        { label: 'Neenotnosti', id: 'maximum' },
      ],
      textFilter: '',
      url: 'https://glej.parlameter.si/group/method/',
      allTags: this.$options.cardData.data.all_tags.map(
        tag => ({ id: tag, label: tag, selected: false }),
      ),
      allMonths: [2017, 2016, 2015, 2014, 2013]
        .map(year =>
          [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(month =>
            ({ id: `${year}-${month}`, label: `${MONTH_NAMES[month - 1]} ${year}`, month, year, selected: false }),
          ),
        )
        .reduce((sum, element) => sum.concat(element), []),
      selectedGroup: 'DZ',
      groups: map(this.$options.cardData.data.results, (group, acronym) => ({
        acronym,
        color: acronym.toLowerCase().replace(/ /g, '_'),
        name: group.organization.name,
      })).filter(group => group.acronym !== 'DZ'),
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
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

      this.getFilteredVotingDays(true).forEach((votingDay) => {
        const [year, month] = votingDay.date.split('-').map(string => parseInt(string, 10));
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
  },
  methods: {
    getFilteredVotingDays(onlyFilterByText = false) {
      const filterBallots = (ballot) => {
        const tagMatch = onlyFilterByText || this.selectedTags.length === 0 ||
          ballot.tag.filter(tag => this.selectedTags.indexOf(tag) > -1).length > 0;
        const textMatch = this.textFilter === '' ||
          ballot.text.toLowerCase().indexOf(this.textFilter.toLowerCase()) > -1;

        return tagMatch && textMatch;
      };

      const filterDates = (votingDay) => {
        if (onlyFilterByText || this.selectedMonths.length === 0) return true;

        const [year, month] = votingDay.date.split('-').map(string => parseInt(string, 10));

        return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
      };

      const votes = sortBy(
        this.data.results[this.selectedGroup].votes,
        this.selectedSort,
      ).reverse();
      const getDateFromVote = vote => (vote.date ? vote.date.split('T')[0] : null);

      let currentVotingDays;

      if (this.selectedSort === 'date') {
        currentVotingDays = groupBy(votes, getDateFromVote);
      } else {
        currentVotingDays = zipObject(votes.map((vote, index) => `${getDateFromVote(vote)}-${index}`), votes.map(vote => [vote]));
      }

      return map(currentVotingDays, (ballots, date) => ({
        date,
        ballots: ballots.filter(filterBallots),
      }))
      .filter(votingDay => votingDay.ballots.length > 0)
      .filter(filterDates);
    },
    selectGroup(groupName) {
      this.selectedGroup = this.selectedGroup !== groupName ? groupName : 'DZ';
    },
    selectSort(sortId) {
      this.selectedSort = sortId;
    },
    shortenUrl() {
      $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${this.url}&frame=true`)}`, (response) => {
        this.shortenedCardUrl = response;
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
  mounted() {
    this.shortenUrl();
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.groups {
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
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
}

  .date-row {
    &:not(:first-child) { margin-top: 20px; }
  }

  .ballot {
    $section-border: 1px solid $black;
    background: $grey;
    margin: 7px 0 8px 0;
    min-height: 90px;
    padding: 10px 14px;
    position: relative;

    @include respond-to(desktop) {
      display: flex;
      margin: 10px 0;
      &:first-child {
        margin-top: 0;
      }
    }

    .disunion {
      text-align: center;
      padding-right: 16px;
      .percentage {
        font-size: 24px;
        @include respond-to(desktop) {
          font-size: 30px;
        }
      }

      .text {
        font-size: 13px;
        line-height: 34px;
        text-transform: uppercase;
        @include respond-to(desktop) {
          font-size: 16px;
          line-height: 23px;
        }
      }
    }

    .name {
      border-bottom: $section-border;
      font-family: Roboto Slab, Times New Roman, serif;
      font-size: 11px;
      font-weight: 300;
      line-height: 1.45em;
      padding: 10px 0 4px 0;

      @include respond-to(desktop) {
        border-bottom: none;
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
      border-bottom: $section-border;
      display: flex;
      justify-content: left;
      padding: 10px 0 0 0;

      @include respond-to(desktop) {
        border-bottom: none;
        border-left: $section-border;
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

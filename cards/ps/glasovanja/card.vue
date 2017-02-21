<template>
  <div id="app" class="card-container <%= className %>" data-id="<%= cardData.group %>/<%= cardData.method %>">
    <div class="card-header">
        <div class="card-header-border"></div>
        <h1>Glasovanja</h1> <!-- this text is the only thing you touch in .card-header -->
    </div>
    <div id="glasovanja-1234" class="card-content full">
        <div class="card-content-front" v-cloak>
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
            <div class="filter option-party-buttons">
              <div v-for="option in allOptions"
              :class="['party-button', option.class, { selected: selectedOptions.indexOf(option.id) > -1 }]"
              @click="toggleOption(option.id)">{{ option.label }}</div>
            </div>
          </div>

          <div class="votes stickinme date-list">
            <template v-for="votingDay in filteredVotingDays">
              <div class="date">{{ votingDay.date }}</div>
              <ul>
                <li v-for="ballot in votingDay.ballots">
                  <div :class="['icon', ballot.option]"></div>
                  <div class="motion">{{ ballot.label }} <a class="funblue-light-hover" :href="'<%= urlsData.base %>/seja/glasovanje/' + ballot.session_id + '/' + ballot.vote_id + ''">{{ ballot.motion }}</a></div>
                  <div class="outcome">{{ ballot.outcome || 'Ni podatkov' }}</div>
                </li>
              </ul>
            </template>
          </div>
        </div>
    </div>
    <div class="card-footer">
        <div class="card-logo hidden">
            <a href="<%= urlsData.base %>">
                <img src="https://cdn.parlameter.si/v1/parlassets/img/logo-parlameter.svg" alt="parlameter logo">
            </a>
        </div>

        <div class="card-circle-button card-share" data-back="share"></div>
        <div class="card-circle-button card-embed" data-back="embed"></div>
        <div class="card-circle-button card-info" data-back="info">i</div>
    </div>
  </div>
</template>

<script>
// import request from 'request'
import SearchDropdown from 'parlassets/components/SearchDropdown.vue'

export default {
  components: { SearchDropdown },
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
        const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));
        const monthId = `${year}-${month}`;
        if (validMonths.indexOf(monthId) === -1) validMonths.push(monthId);

        votingDay.ballots
          .forEach((ballot) => {
            ballot.tags.forEach((tag) => {
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
    selectedOptions() {
      return this.allOptions.filter(option => option.selected)
                            .map(option => option.id);
    },
    filteredVotingDays() {
      return this.getFilteredVotingDays();
    },
    cardUrl() {
      const state = {};

      if (this.selectedTags.length > 0) state.tags = this.selectedTags;
      if (this.selectedMonths.length > 0) state.months = this.selectedMonths.map(month => month.id);
      if (this.textFilter.length > 0) state.text = this.textFilter;
      if (this.selectedOptions.length > 0) state.options = this.selectedOptions;

      return `https://glej.parlameter.si/${this.cardData.group}/${this.cardData.method}/${this.cardData.data.party.id}/?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    allTags() {
      return this.cardData.data.all_tags.map(tag => ({ id: tag, label: tag, selected: false }));
    },
    votingDays() {
      return this.cardData.data.results;
    }
  },
  data() {
    const allMonths = [
      { id: '2017-2', label: 'Februar 2017', month: 2, year: 2017, selected: false },
      { id: '2017-1', label: 'Januar 2017', month: 1, year: 2017, selected: false },
      { id: '2016-12', label: 'December 2016', month: 12, year: 2016, selected: false },
      { id: '2016-11', label: 'November 2016', month: 11, year: 2016, selected: false },
      { id: '2016-10', label: 'Oktober 2016', month: 10, year: 2016, selected: false },
      { id: '2016-9', label: 'September 2016', month: 9, year: 2016, selected: false },
      { id: '2016-8', label: 'Avgust 2016', month: 8, year: 2016, selected: false },
      { id: '2016-7', label: 'Julij 2016', month: 7, year: 2016, selected: false },
      { id: '2016-6', label: 'Junij 2016', month: 6, year: 2016, selected: false },
      { id: '2016-5', label: 'Maj 2016', month: 5, year: 2016, selected: false },
      { id: '2016-4', label: 'April 2016', month: 4, year: 2016, selected: false },
      { id: '2016-3', label: 'Marec 2016', month: 3, year: 2016, selected: false },
      { id: '2016-2', label: 'Februar 2016', month: 2, year: 2016, selected: false },
      { id: '2016-1', label: 'Januar 2016', month: 1, year: 2016, selected: false },
    ];
    const allOptions = [
      { id: 'za', class: 'for', label: 'ZA', selected: false },
      { id: 'proti', class: 'against', label: 'PROTI', selected: false },
      { id: 'kvorum', class: 'kvorum', label: 'VZDRŽANI', selected: false },
      { id: 'ni', class: 'ni', label: 'NISO', selected: false },
    ];
    // const textFilter = this.cardData.state.text || '';
    const textFilter = '';

    // const toggleFromState = (stateParameter, itemArray) => {
    //   if (this.cardData.state[stateParameter]) {
    //     itemArray.forEach((item) => {
    //       if (this.cardData.state[stateParameter].indexOf(item.id) > -1) {
    //         // eslint-disable-next-line no-param-reassign
    //         item.selected = true;
    //       }
    //     });
    //   }
    // };

    // toggleFromState('months', allMonths);
    // toggleFromState('tags', allTags);
    // toggleFromState('options', allOptions);

    return {
      cardData: {
        data: {
          all_tags: [],
          results: [],
          party: {},
          state: {}
        }
      },
      allOptions,
      allMonths,
      textFilter,
      shortenedCardUrl: '',
    };
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

        return tagMatch && textMatch && optionMatch;
      };

      const filterDates = (votingDay) => {
        if (onlyFilterByText || this.selectedMonths.length === 0) return true;

        const [, month, year] = votingDay.date.split(' ').map(string => parseInt(string, 10));

        return this.selectedMonths.filter(m => m.month === month && m.year === year).length > 0;
      };

      return this.votingDays
        .map(votingDay => ({
          date: votingDay.date,
          ballots: votingDay.ballots
            .filter(filterBallots)
            .map((ballot) => {
              const ballotClone = JSON.parse(JSON.stringify(ballot));
              if (ballot.option === 'ni') {
                ballotClone.label = 'Niso glasovali o';
              } else {
                ballotClone.label = `Glasovali ${ballot.option.toUpperCase()}`;
              }

              if (ballot.result !== 'none') {
                ballotClone.outcome = ballot.result === true ? 'Predlog sprejet' : 'Predlog zavrnjen';
              }

              return ballotClone;
            }),
        }))
        .filter(votingDay => votingDay.ballots.length > 0)
        .filter(filterDates);
    },
    shortenUrl(url) {
      // request(`https://parla.me/shortner/generate?url=${encodeURIComponent(`${url}&frame=true`)}`, (response) => {
      //   this.shortenedCardUrl = response;
      //   this.$el.querySelector('.card-content-share button, .btn-copy-embed').textContent = 'KOPIRAJ';
      // });
    },
    loadData(cardData) {
      console.log('LOAD DATA')
      this.cardData = cardData
    }
  },
  created() {
      console.log('CREATED')
    // this.shortenUrl(this.cardUrl);
  },
  watch: {
    cardUrl(newValue) {
      // this.shortenUrl(newValue);
    },
  },
};
</script>

<style lang="sass">
@import 'parlassets/scss/breakpoints';

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

  display: flex;
  justify-content: space-between;

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

.votes {
  flex: 1;
  // list-style: none;
  overflow-y: auto;
  margin-top: 18px;
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

    .icon {
      @include show-for(desktop);

      background-position: center;
      background-repeat: no-repeat;
      background-size: 25px;
      height: 48px;
      width: 52px;

      &.za { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/za.svg"); }
      &.proti { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/proti.svg"); }
      &.ni { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/ni.svg"); }
      &.kvorum { background-image: url("https://cdn.parlameter.si/v1/parlassets/icons/vzdrzan.svg"); }
    }

    .motion {
      flex: 1;
      font-weight: 300;
      line-height: 20px;
      padding: 15px 0;
      a { font-weight: normal; }
    }

    .outcome {
      font-size: 11px;
      font-weight: 400;
      line-height: 13px;
      padding: 20px 15px 0;
      text-align: left;
      text-transform: uppercase;
      width: 90px;
    }
  }
}
</style>

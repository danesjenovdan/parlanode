<template>
  <card-wrapper
    :id="cardData.cardData._id"
    :data-id="`${cardGroup}/${cardMethod}`"
    content-class="full"
    v-bind="{ headerConfig }"
    :card-url="shareUrl"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text'"></p>
    </div>

    <div class="filters">
      <div class="filter text-filter">
        <div class="filter-label" v-t="'contents-search'"></div>
        <search-field v-model="textFilter" @input="searchSpeakings()" />
      </div>

      <!-- ONLY FOR PARTIES, DISPLAY MPs -->
      <div class="filter month-dropdown" v-if="type === 'party'">
        <div class="filter-label" v-t="'mps'"></div>
        <search-dropdown
          :items="allPeople"
          :placeholder="peoplePlaceholder"
          :alphabetise="true"
          :select-callback="searchSpeakings"
          :clear-callback="searchSpeakings"
        />
      </div>
      <!-- ONLY FOR PARTIES, DISPLAY MPs -->

      <div class="filter month-dropdown">
        <div class="filter-label" v-t="'time-period'"></div>
        <search-dropdown
          :items="dropdownMonths"
          :placeholder="monthPlaceholder"
          :alphabetise="false"
          :select-callback="searchSpeakings"
          :clear-callback="searchSpeakings"
        />
      </div>

      <div class="filter month-dropdown">
        <div class="filter-label" v-t="'session-type'"></div>
        <search-dropdown
          :items="dropdownSessions"
          :placeholder="sessionPlaceholder"
          :alphabetise="true"
          :select-callback="searchSpeakings"
          :clear-callback="searchSpeakings"
        />
      </div>
    </div>

    <div class="speaks">
      <scroll-shadow ref="shadow">
        <div id="speaks" v-infinite-scroll="loadMore" infinite-scroll-disabled="busy" infinite-scroll-distance="10" @scroll="$refs.shadow.check($event.currentTarget)">
          <div v-for="speakingDay in groupSpeakingDays" :key="speakingDay[0].session.date">
            <div class="date">{{ speakingDay[0].session.date }}, {{ speakingDay[0].session.name }}, <span v-for="(org, indexOrg) in speakingDay[0].session.orgs" :key="indexOrg">{{ org.name }} <span v-if="indexOrg < (speakingDay[0].session.orgs.length - 1)">,</span></span></div>
            <ul class="speaks__list">
              <govor v-for="speech in speakingDay" :key="speech.speech_id" :speech="speech" css-class="person-speech"></govor>
            </ul>
          </div>
          <div v-if="speakingDays.length===0" class="empty-dataset" v-t="'no-results'"></div>
        </div>
        <div v-if="card.isLoading" class="nalagalnik__wrapper">
          <div class="nalagalnik"></div>
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import Govor from 'components/Govor.vue';
import SearchField from 'components/SearchField.vue';
import SearchDropdown from 'components/SearchDropdown.vue';
import ScrollShadow from 'components/ScrollShadow.vue';

import generateMonths from 'helpers/generateMonths';
import common from 'mixins/common';
import { memberHeader, partyHeader } from 'mixins/altHeaders';

import axios from 'axios';

import infiniteScroll from 'directives/infiniteScroll';

export default {
  directives: {
    infiniteScroll,
  },
  components: {
    SearchField,
    SearchDropdown,
    Govor,
    ScrollShadow,
  },
  mixins: [
    common,
  ],
  data() {
    // console.log(this.party);
    const textFilter = '';
    const allMonths = generateMonths();
    const allPeople = [];

    // const arrayColumn = (arr, n) => arr.map(x => x[n]);

    // const highlightingSession = arrayColumn(this.cardData.data.highlighting, 'session');
    // const highlightingOrgs = [].concat.apply([], arrayColumn(highlightingSession, 'orgs'));
    // let allSessions = highlightingOrgs.map(
    //   org => ({
    //     id: org.id,
    //     label: org.name,
    //     selected: false
    //   })
    // );

    // allSessions = allSessions.map(JSON.stringify).reverse().filter(function(e, i, a) {
    //   return a.indexOf(e, i + 1) === -1;
    // }).reverse().map(JSON.parse)

    const allSessions = this.cardData.data.organizations.map(org => ({
      label: org.name,
      id: org.id,
      selected: false,
    }));

    return {
      card: {
        currentPage: 0,
        isLoading: false,
        lockLoading: false,
        shouldShadow: false,
      },
      cardMethod: this.cardData.cardData.method,
      cardGroup: this.cardData.cardData.group,
      speakingDays: this.cardData.data.highlighting,
      textFilter,
      allMonths,
      allSessions,
      allPeople,
    };
  },
  created() {
    if (this.type === 'party') {
      axios.get(`https://analize.parlameter.si/v1/pg/getMPsOfPG/${this.cardData.data.filters.parties[0]}`).then((response) => {
        this.allPeople = response.data.results.map((person) => {
          const newPerson = {
            id: person.id,
            name: person.name,
            label: person.name,
            selected: false,
          };

          return newPerson;
        });

        // console.log(allPeople);
        // console.log(allMonths);
      });
    }
  },
  mounted() {
    // document.getElementById('speaks').addEventListener('scroll', this.checkScrollPosition)
  },
  computed: {
    shareUrl() {
      const state = {};

      if (this.type === 'person') {
        state.people = this.cardData.parlaState.person;
      } else if (this.type === 'party') {
        state.parties = this.cardData.parlaState.parties;
      }

      if (this.selectedMonths.length > 0) {
        // since dates in month dropdown are generated as m-y we need to prepare them as 1.m.y
        state.time_filter = this.selectedMonths.map((m) => {
          const [year, month] = m.id.split('-');
          return [1, month, year].join('.');
        });
      }

      if (this.selectedSessions.length > 0) {
        state.wb = this.selectedSessions.map(s => s.id);
      }

      if (this.selectedPeople.length > 0) {
        state.people = this.selectedPeople.map(person => person.id);
      }

      state.textFilter = this.textFilter.length ? this.textFilter : '*';

      if (this.type === 'person') {
        return `${this.url}${this.cardData.parlaState.person}?state=${JSON.stringify(state)}&customUrl=${encodeURIComponent(this.cardUrl)}`;
      }
      return `${this.url}${this.cardData.parlaState.parties}?state=${JSON.stringify(state)}&customUrl=${encodeURIComponent(this.cardUrl)}`;
    },
    cardUrl() {
      const state = {};

      if (this.type === 'person') {
        state.people = this.cardData.parlaState.person;
      } else if (this.type === 'party') {
        state.parties = this.cardData.parlaState.parties;
      }

      if (this.selectedMonths.length > 0) {
        // since dates in month dropdown are generated as m-y we need to prepare them as 1.m.y
        state.time_filter = this.selectedMonths.map((m) => {
          const [year, month] = m.id.split('-');
          return [1, month, year].join('.');
        });
      }

      if (this.selectedSessions.length > 0) {
        state.wb = this.selectedSessions.map(s => s.id);
      }

      if (this.selectedPeople.length > 0) {
        state.people = this.selectedPeople.map(person => person.id);
      }

      let encodedQueryData = '';
      if (Object.keys(state).length !== 0) {
        encodedQueryData = this.encodeQueryData(state);
      }

      const textFilter = this.textFilter.length ? this.textFilter : '*';

      return `https://isci.parlameter.si/filter/${textFilter}/${this.card.currentPage}${encodedQueryData}`;
    },
    selectedSessions() {
      return this.allSessions.filter(session => session.selected);
    },
    selectedMonths() {
      return this.allMonths.filter(month => month.selected);
    },
    selectedPeople() {
      return this.allPeople.filter(person => person.selected);
    },
    sessionPlaceholder() {
      return this.selectedSessions.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedSessions.length })
        : this.$t('select-placeholder');
    },
    monthPlaceholder() {
      return this.selectedMonths.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedMonths.length })
        : this.$t('select-placeholder');
    },
    peoplePlaceholder() {
      return this.selectedPeople.length > 0
        ? this.$t('selected-placeholder', { num: this.selectedPeople.length })
        : this.$t('select-placeholder');
    },
    dropdownItems() {
      return {
        months: this.allMonths,
        sessions: this.allSessions,
      };
    },
    dropdownMonths() {
      return this.allMonths;
    },
    dropdownSessions() {
      return this.allSessions;
    },
    groupSpeakingDays() {
      return this.speakingDays
        .reduce((r, a) => {
          r[a.session_id] = r[a.session_id] || [];
          r[a.session_id].push(a);
          return r;
        }, Object.create(null));
    },
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
  },
  methods: {
    searchSpeakings(waitTime = 750) {
      if (!Number.isInteger(waitTime)) {
        waitTime = 0;
      }

      this.card.lockLoading = true;
      setTimeout(() => {
        if (!this.card.isLoading) {
          this.card.currentPage = 0;
          this.card.isLoading = true;
          axios.get(this.cardUrl).then((response) => {
            this.speakingDays = response.data.highlighting;
            this.speakingDays = response.data.highlighting;
            this.card.isLoading = false;
          });
        }
        this.card.lockLoading = false;
      }, waitTime);
    },
    loadMore() {
      if (this.card.lockLoading || this.card.isLoading) return;
      this.card.isLoading = true;
      this.card.currentPage += 1;

      axios.get(this.cardUrl).then((response) => {
        this.speakingDays = this.speakingDays.concat(response.data.highlighting);

        this.card.isLoading = false;

        // end infinite scrolling
        if (response.data.response.start >= response.data.response.numFound) {
          // @todo decide what to show when no more data
          this.card.lockLoading = true;
        }
      });
    },
    checkScrollPosition() {
      if (!this.card.lockLoading) {
        this.card.lockLoading = true;
        setTimeout(() => {
          if (document) {
            this.card.shouldShadow = document.getElementById('speaks').scrollTop > 0;
          }
          this.card.lockLoading = false;
        }, 200);
      }
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
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

.search-field {
  background-image: url('https://cdn.parlameter.si/v1/parlassets/icons/search_blue.svg');
}

.filters {
  .filter {
    @include respond-to(desktop) {
      margin-right: 10px;
      flex: 1;
    }
    @include respond-to(mobile) {
      width: 100%;
    }
    &:last-child {
      margin-right: 0;
    }
  }

  padding-bottom: 12px;
  @include respond-to(mobile) {
    flex-wrap: wrap;
    min-height: 154px;
  }

  display: flex;

  .option-party-buttons {
    @include show-for(desktop,
    flex);
    width: 27.5%;
    padding-top: 26px;
    .party-button:not(:last-child) {
      margin-right: 3px;
    }
  }
}

.empty-dataset {
  font-size: 16px;
  font-style: italic;
  line-height: 20px;
  margin: 70px 0;
  text-align: center;
  color: $grey-medium;
  font-style: normal;
}

#speaks {
  height: 433px;
  overflow-y: auto;

  @include respond-to(mobile) {
    height: 216px;
  }
}

.speaks {
  flex: 1;
  position: relative;
  padding-bottom: 20px;

  &__list {
    padding: 0 0 10px;
    margin: 0;
  }

  .nalagalnik__wrapper {
    background: rgba(255, 255, 255, .75);
    height: 100%;
    left: 0;
    position: absolute;
    top: 0;
    width: 100%;

    .nalagalnik {
      position: absolute;
      top: calc(50% - 50px);
    }
  }

  .date {
    background-color: #f0f0f0;
    font-weight: bold;
    padding: 10px;
  }
}
</style>

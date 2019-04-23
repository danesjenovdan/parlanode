<template>
  <card-wrapper
    :id="cardData.mountId"
    :header-config="headerConfig"
    :og-config="ogConfig"
    :card-url="generatedCardUrl"
    content-class="full"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <div class="filters">
      <div class="filter text-filter">
        <div v-t="'contents-search'" class="filter-label"></div>
        <search-field v-model="textFilter" @input="searchSpeakings(true)" />
      </div>
      <!-- ONLY FOR PARTIES, DISPLAY MPs -->
      <div v-if="type === 'party'" class="filter month-dropdown">
        <div v-t="'mps'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allPeople"
          @input="searchSpeakings"
        />
      </div>
      <!-- ONLY FOR PARTIES, DISPLAY MPs -->
      <div class="filter month-dropdown">
        <div v-t="'time-period'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allMonths"
          :alphabetise="false"
          @input="searchSpeakings"
          @clear="searchSpeakings"
        />
      </div>
      <div v-if="allWorkingBodies.length" class="filter month-dropdown">
        <div v-t="'session-type'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allWorkingBodies"
          @input="searchSpeakings"
          @clear="searchSpeakings"
        />
      </div>
    </div>

    <div class="speaks">
      <scroll-shadow ref="shadow">
        <div
          v-infinite-scroll="loadMore"
          id="speaks"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <div v-for="speakingDay in groupSpeakingDays" :key="speakingDay[0].session.id">
            <div class="date">
              {{ speakingDay[0].session.date }}, {{ speakingDay[0].session.name }},
              {{ ' ' + speakingDay[0].session.orgs.map(org => org.name).join(', ') }}
            </div>
            <ul class="speaks__list">
              <govor
                v-for="speech in speakingDay"
                :key="speech.speech_id"
                :speech="speech"
                css-class="person-speech"
              />
            </ul>
          </div>
          <div v-t="'no-results'" v-if="speakingDays.length===0" class="empty-dataset"></div>
        </div>
        <div v-if="card.isLoading" class="nalagalnik__wrapper">
          <div class="nalagalnik"></div>
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import Govor from 'components/Govor.vue';
import SearchField from 'components/SearchField.vue';
import PSearchDropdown from 'components/SearchDropdown.vue';
import ScrollShadow from 'components/ScrollShadow.vue';
import generateMonths from 'mixins/generateMonths';
import common from 'mixins/common';
import { memberTitle, partyTitle } from 'mixins/titles';
import { memberHeader, partyHeader } from 'mixins/altHeaders';
import { memberOgImage, partyOgImage } from 'mixins/ogImages';
import { memberSpeeches, partySpeeches } from 'mixins/contextUrls';
import infiniteScroll from 'directives/infiniteScroll';

export default {
  directives: {
    infiniteScroll,
  },
  components: {
    SearchField,
    PSearchDropdown,
    Govor,
    ScrollShadow,
  },
  mixins: [
    common,
    generateMonths,
  ],
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
    person: {
      type: Object,
      default: () => ({}),
    },
    party: {
      type: Object,
      default: () => ({}),
    },
  },
  data() {
    const state = this.cardData.parlaState;

    const allPeople = [];

    const allMonths = this.generateMonths(this.$t('months'));
    allMonths.forEach((month) => {
      month.selected = (state.months || []).indexOf(month.id) !== -1;
    });

    const allWorkingBodies = (this.cardData.data.organizations || []).map(org => ({
      label: org.name,
      id: org.id,
      selected: (state.wb || []).indexOf(org.id) !== -1,
    }));

    const textFilter = (state.textFilter && state.textFilter.length && state.textFilter !== '*')
      ? state.textFilter
      : '';

    return {
      card: {
        currentPage: 0,
        isLoading: false,
        lockLoading: false,
        shouldShadow: false,
      },
      speakingDays: (this.cardData.data.response && this.cardData.data.response.docs) || [],
      textFilter,
      allMonths,
      allWorkingBodies,
      allPeople,
    };
  },
  computed: {
    generatedCardUrl() {
      const state = {};

      if (this.type === 'person') {
        state.people = this.person.id;
      } else if (this.type === 'party') {
        state.parties = this.party.id;
        state.people = this.selectedPeople.map(p => p.id);
      }

      if (this.selectedMonths.length > 0) {
        state.months = this.selectedMonths.map(m => m.id);
      }

      if (this.selectedWorkingBodies.length > 0) {
        state.wb = this.selectedWorkingBodies.map(org => org.id);
      }

      state.textFilter = this.textFilter || '*';

      return `${this.url}${this.type === 'person' ? this.person.id : this.party.id}?state=${encodeURIComponent(JSON.stringify(state))}&customUrl=${encodeURIComponent(this.searchUrl)}`;
    },
    searchUrl() {
      const state = {};

      if (this.type === 'person') {
        state.people = this.person.id;
      } else if (this.type === 'party') {
        state.parties = this.party.id;
        state.people = this.selectedPeople.map(p => p.id).join(',');
      }

      if (this.selectedMonths.length > 0) {
        state.months = this.selectedMonths.map(m => m.id).join(',');
      }

      if (this.selectedWorkingBodies.length > 0) {
        state.wb = this.selectedWorkingBodies.map(s => s.id);
      }

      if (this.selectedPeople.length > 0) {
        state.people = this.selectedPeople.map(person => person.id);
      }

      if (this.textFilter.length && this.textFIlter !== '*') {
        state.q = this.textFilter;
      }

      if (this.card.currentPage > 0) {
        state.page = this.card.currentPage;
      }

      let encodedQueryData = '';
      if (Object.keys(state).length !== 0) {
        encodedQueryData = this.encodeQueryData(state);
      }

      return `${this.slugs.urls.isci}/search/speeches${encodedQueryData}`;
    },
    selectedWorkingBodies() {
      return this.allWorkingBodies.filter(session => session.selected);
    },
    selectedMonths() {
      return this.allMonths.filter(month => month.selected);
    },
    selectedPeople() {
      return this.allPeople.filter(person => person.selected);
    },
    groupSpeakingDays() {
      return this.speakingDays
        .reduce((r, a) => {
          const key = `${a.start_time}__${a.session_id}`;
          r[key] = r[key] || [];
          r[key].push(a);
          return r;
        }, Object.create(null));
    },
    headerConfig() {
      if (this.type === 'person') {
        return memberHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return memberOgImage.computed.ogConfig.call(this);
      }
      return partyOgImage.computed.ogConfig.call(this);
    },
  },
  created() {
    (this.type === 'person' ? memberSpeeches : partySpeeches).created.call(this);
    (this.type === 'person' ? memberTitle : partyTitle).created.call(this);

    if (this.type === 'party') {
      axios.get(`${this.slugs.urls.analize}/pg/getMPsOfPG/${this.party.id}`).then((response) => {
        this.allPeople = response.data.results.map(person => ({
          id: person.id,
          name: person.name,
          label: person.name,
          selected: (this.cardData.parlaState.people || []).indexOf(person.id) !== -1,
        }));
      });
    }
  },
  mounted() {
    // document.getElementById('speaks').addEventListener('scroll', this.checkScrollPosition)
  },
  methods: {
    searchSpeakings(delay = false) {
      const waitTime = delay ? 750 : 0;

      this.card.lockLoading = true;
      setTimeout(() => {
        if (!this.card.isLoading) {
          this.card.currentPage = 0;
          this.card.isLoading = true;
          axios.get(this.searchUrl).then((response) => {
            this.speakingDays = response.data.response.docs;
            this.card.isLoading = false;
          });
        }
        this.card.lockLoading = false;
      }, waitTime);
    },
    loadMore() {
      if (this.card.lockLoading || this.card.isLoading) {
        return;
      }
      this.card.isLoading = true;
      this.card.currentPage += 1;

      axios.get(this.searchUrl).then((response) => {
        this.speakingDays = this.speakingDays.concat(response.data.response.docs);

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
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';
@import '~parlassets/scss/colors';

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
  color: $font-placeholder;
  font-style: normal;
}

#speaks {
  height: $full-card-height - 83px;
  overflow-x: hidden;
  overflow-y: auto;
  overflow-anchor: none;

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
    background: $white-hover;
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
    background-color: $background;
    font-weight: bold;
    padding: 10px;
  }
}
</style>

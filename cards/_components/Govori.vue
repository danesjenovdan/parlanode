<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div class="filters">
      <div class="filter text-filter">
        <div v-t="'contents-search'" class="filter-label"></div>
        <search-field
          v-model="textFilter"
          @update:modelValue="searchSpeakings(true)"
        />
      </div>
      <div v-if="type === 'party' && allPeople.length" class="filter">
        <div v-t="'mps'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allPeople"
          @update:modelValue="searchSpeakings"
        />
      </div>
      <!-- <div class="filter">
        <div v-t="'time-period'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allMonths"
          :alphabetise="false"
          @update:modelValue="searchSpeakings"
          @clear="searchSpeakings"
        />
      </div> -->
      <div v-if="allWorkingBodies.length" class="filter">
        <div v-t="'session-type'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allWorkingBodies"
          @update:modelValue="searchSpeakings"
          @clear="searchSpeakings"
        />
      </div>
    </div>

    <div class="speaks">
      <scroll-shadow ref="shadow">
        <div
          id="speaks"
          v-infinite-scroll="loadMore"
          infinite-scroll-disabled="busy"
          infinite-scroll-distance="10"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <div v-for="(speakingDay, key) in groupSpeakingDays" :key="key">
            <div class="date">
              {{ formatSpeechDate(speakingDay[0]) }},
              {{ speakingDay[0].session?.name }},
              {{
                ' ' +
                speakingDay[0].session?.organizations
                  ?.map((org) => org.name)
                  .join(', ')
              }}
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
          <div
            v-if="!speeches.length"
            v-t="'no-results'"
            class="empty-dataset"
          ></div>
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
import { groupBy } from 'lodash-es';
import Govor from '@/_components/Govor.vue';
import SearchField from '@/_components/SearchField.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import generateMonths from '@/_mixins/generateMonths.js';
import common from '@/_mixins/common.js';
import { personTitle, partyTitle } from '@/_mixins/titles.js';
import { personHeader, partyHeader } from '@/_mixins/altHeaders.js';
import { personOgImage, partyOgImage } from '@/_mixins/ogImages.js';
import { personSpeeches, partySpeeches } from '@/_mixins/contextUrls.js';
import infiniteScroll from '@/_directives/infiniteScroll.js';
import dateFormatter from '@/_helpers/dateFormatter.js';
import getD3Locale from '@/_i18n/d3locales.js';

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
  mixins: [common, generateMonths],
  props: {
    type: {
      type: String,
      required: true,
      validator: (value) => ['person', 'party'].indexOf(value) > -1,
    },
  },
  data() {
    const state = this.cardState;

    const allPeople = [];

    const { months } = getD3Locale(this.$i18n.locale);
    const start = this.cardData.facet_counts?.facet_ranges?.start_time?.start;
    const allMonths = this.generateMonths(months, start);
    allMonths.forEach((month) => {
      month.selected = (state.months || []).indexOf(month.id) !== -1;
    });

    const allWorkingBodies = (this.cardData.organizations || []).map((org) => ({
      label: org.name,
      id: org.id,
      selected: (state.wb || []).indexOf(org.id) !== -1,
    }));

    const textFilter =
      state.textFilter && state.textFilter.length && state.textFilter !== '*'
        ? state.textFilter
        : '';

    return {
      card: {
        currentPage: 0,
        isLoading: false,
        lockLoading: false,
        shouldShadow: false,
      },
      speeches: this.cardData.data?.results || [],
      textFilter,
      allMonths,
      allWorkingBodies,
      allPeople,
    };
  },
  computed: {
    searchUrl() {
      const state = {};

      if (this.type === 'person') {
        state.people = this.cardData.person.id;
      } else if (this.type === 'party') {
        state.parties = this.cardData.party.id;
        state.people = this.selectedPeople.map((p) => p.id).join(',');
      }

      if (this.selectedMonths.length > 0) {
        state.months = this.selectedMonths.map((m) => m.id).join(',');
      }

      if (this.selectedWorkingBodies.length > 0) {
        state.wb = this.selectedWorkingBodies.map((s) => s.id);
      }

      if (this.selectedPeople.length > 0) {
        state.people = this.selectedPeople.map((person) => person.id);
      }

      if (this.textFilter.length && this.textFilter !== '*') {
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
      return this.allWorkingBodies.filter((session) => session.selected);
    },
    selectedMonths() {
      return this.allMonths.filter((month) => month.selected);
    },
    selectedPeople() {
      return this.allPeople.filter((person) => person.selected);
    },
    groupSpeakingDays() {
      return groupBy(this.speeches, (o) => {
        const dateTime = o.start_time || o.session?.start_time || '';
        const date = dateTime.split('T')[0];
        return `${date}__${o.session?.id}`;
      });
    },
    headerConfig() {
      if (this.type === 'person') {
        return personHeader.computed.headerConfig.call(this);
      }
      return partyHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return personOgImage.computed.ogConfig.call(this);
      }
      return partyOgImage.computed.ogConfig.call(this);
    },
  },
  created() {
    (this.type === 'person' ? personSpeeches : partySpeeches).created.call(
      this
    );
    (this.type === 'person' ? personTitle : partyTitle).created.call(this);

    // if (this.type === 'party') {
    //   axios
    //     .get(
    //       `${this.slugs.urls.analize}/pg/getMPsOfPG/${this.cardData.party.id}`
    //     )
    //     .then((response) => {
    //       this.allPeople = response.data.results.map((person) => ({
    //         id: person.id,
    //         name: person.name,
    //         label: person.name,
    //         selected: (this.cardState.people || []).indexOf(person.id) !== -1,
    //       }));
    //     });
    // }
  },
  mounted() {
    // document.getElementById('speaks').addEventListener('scroll', this.checkScrollPosition)
  },
  methods: {
    formatSpeechDate(speech) {
      return dateFormatter(speech.start_time || speech.session?.start_time);
    },
    searchSpeakings(delay = false) {
      // const waitTime = delay ? 750 : 0;
      // this.card.lockLoading = true;
      // setTimeout(() => {
      //   if (!this.card.isLoading) {
      //     this.card.currentPage = 0;
      //     this.card.isLoading = true;
      //     axios.get(this.searchUrl).then((response) => {
      //       this.speakingDays = response.data.response.docs;
      //       this.card.isLoading = false;
      //     });
      //   }
      //   this.card.lockLoading = false;
      // }, waitTime);
    },
    loadMore() {
      // if (this.card.lockLoading || this.card.isLoading) {
      //   return;
      // }
      // this.card.isLoading = true;
      // this.card.currentPage += 1;
      // axios.get(this.searchUrl).then((response) => {
      //   this.speakingDays = this.speakingDays.concat(
      //     response.data.response.docs
      //   );
      //   this.card.isLoading = false;
      //   // end infinite scrolling
      //   if (response.data.response.start >= response.data.response.numFound) {
      //     // @todo decide what to show when no more data
      //     this.card.lockLoading = true;
      //   }
      // });
    },
    checkScrollPosition() {
      if (!this.card.lockLoading) {
        this.card.lockLoading = true;
        setTimeout(() => {
          if (document) {
            this.card.shouldShadow =
              document.getElementById('speaks').scrollTop > 0;
          }
          this.card.lockLoading = false;
        }, 200);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

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
    .filter-label {
      height: 20px;
      margin-top: 6px;
    }
  }

  .text-filter {
    flex-basis: 100%;

    @include respond-to(desktop) {
      flex-basis: 50%;
      flex-grow: 0;
    }
  }

  padding-bottom: 12px;
  @include respond-to(mobile) {
    flex-wrap: wrap;
    min-height: 154px;
  }

  display: flex;

  .option-party-buttons {
    @include show-for(desktop, flex);
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

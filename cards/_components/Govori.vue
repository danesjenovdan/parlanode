<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div v-if="type !== 'search'" class="filters">
      <div class="filter text-filter">
        <div v-t="'contents-search'" class="filter-label"></div>
        <search-field
          v-model="textFilter"
          @update:modelValue="searchSpeeches"
        />
      </div>
      <div v-if="type === 'party' && allPeople.length" class="filter">
        <div v-t="'mps'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allPeople"
          @update:modelValue="searchSpeeches"
        />
      </div>
      <div class="filter">
        <div v-t="'time-period'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allMonths"
          :alphabetise="false"
          @update:modelValue="searchSpeeches"
          @clear="searchSpeeches"
        />
      </div>
      <div v-if="allWorkingBodies.length" class="filter">
        <div v-t="'session-type'" class="filter-label"></div>
        <p-search-dropdown
          v-model="allWorkingBodies"
          @update:modelValue="searchSpeeches"
          @clear="searchSpeeches"
        />
      </div>
    </div>

    <div class="speeches">
      <scroll-shadow ref="shadow">
        <div
          v-infinite-scroll="loadMore"
          :class="[
            'speeches-list-shadow',
            { 'has-filters': type !== 'search' },
          ]"
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
            <ul class="speeches__list">
              <govor
                v-for="speech in speakingDay"
                :key="speech.speech_id"
                :speech="speech"
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
import axios, { CancelToken } from 'axios';
import { groupBy, debounce } from 'lodash-es';
import Govor from '@/_components/Govor.vue';
import SearchField from '@/_components/SearchField.vue';
import PSearchDropdown from '@/_components/SearchDropdown.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import generateMonths from '@/_mixins/generateMonths.js';
import common from '@/_mixins/common.js';
import { personTitle, partyTitle, searchTitle } from '@/_mixins/titles.js';
import {
  personHeader,
  partyHeader,
  searchHeader,
} from '@/_mixins/altHeaders.js';
import {
  personOgImage,
  partyOgImage,
  searchOgImage,
} from '@/_mixins/ogImages.js';
import {
  personSpeeches,
  partySpeeches,
  search as searchContext,
} from '@/_mixins/contextUrls.js';
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
      validator: (value) => ['person', 'party', 'search'].includes(value),
    },
  },
  data() {
    const state = this.cardState;

    const allPeople = [];

    const { months } = getD3Locale(this.$i18n.locale);
    const start = this.cardData.data?.mandate?.beginning;
    const allMonths = this.generateMonths(months, start);
    allMonths.forEach((month) => {
      month.selected = (state.months || []).includes(month.id);
    });

    const allWorkingBodies = (this.cardData.organizations || []).map((org) => ({
      label: org.name,
      id: org.id,
      selected: (state.wb || []).indexOf(org.id) !== -1,
    }));

    const textFilter = state.text || '';

    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      speeches: this.cardData.data?.results || [],
      textFilter,
      allMonths,
      allWorkingBodies,
      allPeople,
      cancelRequest: null,
    };
  },
  computed: {
    searchUrl() {
      const url = new URL(this.cardData.url);

      const months = this.selectedMonths.map((m) => m.id).join(',');
      url.searchParams.set('months', months);

      url.searchParams.set('text', this.textFilter);

      url.searchParams.set('page', this.card.currentPage);

      return url.toString();
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
      if (this.type === 'party') {
        return partyHeader.computed.headerConfig.call(this);
      }
      return searchHeader.computed.headerConfig.call(this);
    },
    ogConfig() {
      if (this.type === 'person') {
        return personOgImage.computed.ogConfig.call(this);
      }
      if (this.type === 'party') {
        return partyOgImage.computed.ogConfig.call(this);
      }
      return searchOgImage.computed.ogConfig.call(this);
    },
  },
  created() {
    if (this.type === 'person') {
      personSpeeches.created.call(this);
      personTitle.created.call(this);
    }
    if (this.type === 'party') {
      partySpeeches.created.call(this);
      partyTitle.created.call(this);
    }
    // TODO: search
    searchContext.created.call(this);
    searchTitle.created.call(this);
  },
  methods: {
    formatSpeechDate(speech) {
      return dateFormatter(speech.start_time || speech.session?.start_time);
    },
    makeRequest(url) {
      if (this.cancelRequest) {
        this.cancelRequest();
        this.cancelRequest = null;
      }

      return axios
        .get(url, {
          cancelToken: new CancelToken((c) => {
            this.cancelRequest = c;
          }),
        })
        .then(
          (response) => {
            this.cancelRequest = null;
            return response;
          },
          (error) => {
            this.cancelRequest = null;
            throw error;
          }
        );
    },
    searchSpeeches: debounce(function searchSpeeches() {
      this.card.isLoading = true;
      this.makeRequest(this.searchUrl).then((response) => {
        this.speeches = response?.data?.results || [];
        this.card.currentPage = 1;
        this.card.isLoading = false;
      });
    }, 750),
    loadMore() {
      if (this.card.isLoading) {
        return;
      }
      if (this.speeches.length >= this.cardData.data?.count) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.page === requestedPage) {
          const newSpeeches = response?.data?.results || [];
          this.speeches.push(...newSpeeches);
        }
        this.card.isLoading = false;
      });
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

.speeches {
  .speeches-list-shadow {
    overflow-y: auto;
    overflow-x: hidden;
    height: $full-card-height;

    &.has-filters {
      height: $full-card-height - 89;
    }
  }

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

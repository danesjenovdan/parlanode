<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig">
    <div class="votes-list">
      <div class="filters">
        <div class="filter text-filter">
          <div v-t="'title-search'" class="filter-label"></div>
          <input v-model="textFilter" class="text-filter-input" type="text" />
        </div>
        <div class="filter" style="flex: 1"></div>
        <div v-if="type === 'person'" class="filter buttons-filter">
          <striped-button
            v-for="voteOption in voteOptions"
            :key="voteOption.id"
            :color="voteOption.color"
            :selected="selectedVoteOptions.includes(voteOption)"
            :small-text="voteOption.label"
            @click="toggleVoteOption(voteOption)"
          />
        </div>
        <!-- <div v-if="type === 'party'" class="filter text-filter">
          <div v-t="'sort-by'" class="filter-label"></div>
          <toggle v-model="selectedSort" :options="sortOptions" />
        </div> -->
      </div>

      <scroll-shadow ref="shadow">
        <div
          v-infinite-scroll="loadMore"
          class="votes-list-shadow has-filters date-list"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <template v-for="(dayBallots, key) in filteredVotingDays" :key="key">
            <div
              v-if="type === 'person' || selectedSort === 'date'"
              class="date"
            >
              {{ formatDate(dayBallots[0].timestamp) }},
              {{ formatSessionInfo(dayBallots[0].session) }}
            </div>
            <ballot
              v-for="ballot in dayBallots"
              :key="`${ballot.timestamp}_${ballot.motion.id}`"
              :ballot="ballot"
              type="person"
            />
          </template>
        </div>
        <div v-if="card.isLoading" class="nalagalnik__wrapper">
          <div class="nalagalnik"></div>
        </div>
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import { groupBy } from 'lodash-es';
import axios from 'axios';
import common from '@/_mixins/common.js';
import { personHeader, partyHeader } from '@/_mixins/altHeaders.js';
import { personOgImage, partyOgImage } from '@/_mixins/ogImages.js';
import { personVotes, partyVotes } from '@/_mixins/contextUrls.js';
import { personTitle, partyTitle } from '@/_mixins/titles.js';
import StripedButton from '@/_components/StripedButton.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import Ballot from '@/_components/Ballot.vue';
import infiniteScroll from '@/_directives/infiniteScroll.js';
import dateFormatter from '@/_helpers/dateFormatter.js';

export default {
  directives: {
    infiniteScroll,
  },
  components: {
    StripedButton,
    ScrollShadow,
    Ballot,
  },
  mixins: [common],
  props: {
    contextData: {
      type: Object,
      required: true,
    },
    type: {
      type: String,
      required: true,
      validator: (value) => ['person', 'party'].indexOf(value) > -1,
    },
  },
  data() {
    const textFilter = this.cardState.text || '';

    const voteFilters = (this.cardState.voteFilter || '').split(',');
    const voteOptions = [
      {
        id: 'for',
        color: 'for',
        label: this.$t('vote-for'),
        selected: voteFilters.includes('for'),
      },
      {
        id: 'against',
        color: 'against',
        label: this.$t('vote-against'),
        selected: voteFilters.includes('against'),
      },
      {
        id: 'abstain',
        color: 'abstain',
        label:
          this.type === 'person'
            ? this.$t('vote-abstain')
            : this.$t('vote-abstain-plural'),
        selected: voteFilters.includes('abstain'),
      },
      {
        id: 'absent',
        color: 'absent',
        label:
          this.type === 'person'
            ? this.$t('vote-absent')
            : this.$t('vote-absent-plural'),
        selected: voteFilters.includes('absent'),
      },
    ];

    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      results: this.cardData.data?.results ?? [],
      textFilter,
      voteOptions,
      selectedSort: 'date',
      // sortOptions: {
      //   maximum: this.$t('sort-by--inequality'),
      //   date: this.$t('sort-by--date'),
      // },
      // TODO: neenakost filter pri grupah
    };
  },
  computed: {
    selectedVoteOptions() {
      return this.voteOptions.filter((vo) => vo.selected);
    },
    filteredVotingDays() {
      let form = 'plural';
      if (this.type === 'person') {
        form =
          this.cardData.data?.person?.preferred_pronoun === 'she' ? 'f' : 'm';
      }

      const lowerTextFilter = String(this.textFilter || '').toLowerCase();
      const selectedVoteOptionIds = this.selectedVoteOptions.map((vo) => vo.id);

      const filteredResults = this.results
        .filter((r) => {
          let textMatch = true;
          let voteOptionMatch = true;

          if (lowerTextFilter) {
            textMatch = r.motion.text.toLowerCase().includes(lowerTextFilter);
          }

          if (selectedVoteOptionIds.length) {
            voteOptionMatch = selectedVoteOptionIds.includes(r.option);
          }

          return textMatch && voteOptionMatch;
        })
        .filter((r) => r.option != null) // api returns null if nobody from this group voted
        .map((r) => ({
          ...r,
          label: this.$t(`voted-${r.option}--${form}`),
        }));

      return groupBy(filteredResults, (o) => {
        const dateTime = o.timestamp || o.session?.start_time || '';
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
    searchUrl() {
      const url = new URL(this.cardData.url);
      url.searchParams.set('page', this.card.currentPage);
      return url.toString();
    },
  },
  created() {
    (this.type === 'person' ? personVotes : partyVotes).created.call(this);
    (this.type === 'person' ? personTitle : partyTitle).created.call(this);
  },
  methods: {
    toggleVoteOption(voteOption) {
      voteOption.selected = !voteOption.selected;
    },
    loadMore() {
      if (this.card.isLoading) {
        return;
      }
      if (this.results.length >= this.cardData.data?.count) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.page === requestedPage) {
          const newResults = response?.data?.results || [];
          this.results.push(...newResults);
        }
        this.card.isLoading = false;
      });
    },
    formatDate(date) {
      return dateFormatter(date);
    },
    formatSessionInfo(session) {
      const orgNames = session?.organizations?.map((org) => org.name);
      const orgList = orgNames?.length ? ` (${orgNames.join(', ')})` : '';
      return `${session?.name || ''}${orgList}`;
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

.votes-list {
  .filters {
    display: flex;
    padding-bottom: 12px;

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
      height: 20px;
      margin-top: 6px;
    }

    .text-filter {
      @include respond-to(desktop) {
        width: 50%;
      }

      width: 100%;

      .text-filter-input {
        background-image: url('#{get-parlassets-url()}/icons/search.svg');
        background-size: 24px 24px;
        background-repeat: no-repeat;
        background-position: right 9px center;
        border: 1px solid $font-placeholder;
        font-size: 16px;
        height: 51px;
        line-height: 27px;
        outline: none;
        padding: 12px 42px 12px 14px;
        width: 100%;
      }
    }

    .buttons-filter {
      display: flex;
      align-items: flex-end;
      gap: 3px;

      .striped-button {
        width: 80px;
      }
    }
  }

  .votes-list-shadow {
    overflow-y: auto;
    overflow-x: hidden;
    height: $full-card-height - 89;
  }

  .nalagalnik__wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: $white-hover;
    z-index: 4;

    .nalagalnik {
      position: absolute;
      top: calc(50% - 50px);
    }
  }
}
</style>

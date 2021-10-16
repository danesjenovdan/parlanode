<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig" max-height>
    <div class="session-name">{{ session.name }}</div>
    <div class="session-date">{{ formatDate(session.start_time) }}</div>
    <hr />
    <div class="link">
      <a :href="getSessionTranscriptLink(session)" class="funblue-light-hover">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'card.tfidf-title'"></span>
      </a>
    </div>
    <div v-if="chartRows.length" class="columns">
      <bar-chart :data="chartRows1" :max="max" :total="total" />
      <bar-chart :data="chartRows2" :max="max" :total="total" />
    </div>
    <hr />
    <div class="link">
      <span class="link-color">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'card.attendance-title'"></span>
      </span>
    </div>
    <attendance-by-groups :data="attendance" />
    <hr />
    <div class="link">
      <a :href="getSessionVotesLink(session)" class="funblue-light-hover">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'card.votes-title'"></span>
      </a>
    </div>
    <div class="votes-list">
      <scroll-shadow ref="shadow">
        <div
          v-infinite-scroll="loadMore"
          class="votes-list-shadow"
          @scroll="$refs.shadow.check($event.currentTarget)"
        >
          <vote-list-item
            v-for="vote in votes"
            :key="vote.id"
            :vote="vote"
            :session="session"
          />
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
import { max, sum } from 'lodash-es';
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import BarChart from '@/_components/BarChart.vue';
import AttendanceByGroups from '@/_components/AttendanceByGroups.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import VoteListItem from '@/_components/VoteListItem.vue';
import links from '@/_mixins/links.js';
import infiniteScroll from '@/_directives/infiniteScroll.js';
import dateFormatter from '@/_helpers/dateFormatter.js';

export default {
  name: 'CardMiscLastSession',
  directives: {
    infiniteScroll,
  },
  components: {
    BarChart,
    AttendanceByGroups,
    VoteListItem,
    ScrollShadow,
  },
  mixins: [common, sessionHeader, sessionOgImage, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      card: {
        currentPage: 1,
        isLoading: false,
      },
      session: cardData?.data?.session || {},
      tfidf: cardData?.data?.results?.tfidf || [],
      attendance: cardData?.data?.results?.attendance || [],
      votes: cardData?.data?.results?.votes || [],
    };
  },
  computed: {
    max() {
      return max(this.tfidf.map((item) => item.value || 0)) * 5000;
    },
    total() {
      return sum(this.tfidf.map((item) => item.value || 0)) * 5000;
    },
    chartRows() {
      return this.tfidf.map((item) => ({
        label: item.token,
        value: Math.round(item.value * 5000),
        link: this.getSearchTermLink(item.term),
      }));
    },
    chartRows1() {
      return this.chartRows.slice(0, 5);
    },
    chartRows2() {
      return this.chartRows.slice(5, 10);
    },
    searchUrl() {
      const url = new URL(this.cardData.url);
      url.searchParams.set('votes:page', this.card.currentPage);
      return url.toString();
    },
  },
  methods: {
    formatDate: dateFormatter,
    loadMore() {
      if (this.card.isLoading) {
        return;
      }
      if (this.votes.length >= this.cardData.data?.['votes:count']) {
        return;
      }

      this.card.isLoading = true;
      this.card.currentPage += 1;

      const requestedPage = this.card.currentPage;
      axios.get(this.searchUrl).then((response) => {
        if (response?.data?.['votes:page'] === requestedPage) {
          const newVotes = response?.data?.results?.votes || [];
          this.votes.push(...newVotes);
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

.session-name {
  font-weight: 500;
  font-size: 16px;
}

hr,
.link {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;

  .link-color {
    color: $link;
  }

  .glyphicon {
    margin-right: 5px;

    &::before {
      position: relative;
      bottom: -1px;
    }
  }
}

.columns {
  display: flex;

  .word-list {
    flex: 1 1 auto;

    &:first-child {
      margin-right: 20px;
    }
  }

  @include respond-to(mobile) {
    flex-direction: column;

    .word-list {
      margin-bottom: 0;
      margin-right: 0 !important;

      :deep(.column-label) {
        flex: 0 0 33%;

        .chart-label {
          word-break: break-word;
        }
      }

      :deep(.column-bar) {
        flex: 0 0 66%;
      }
    }

    .word-list + .word-list {
      margin-top: -10px;
    }
  }
}

.votes-list {
  .votes-list-shadow {
    overflow-y: auto;
    overflow-x: hidden;
    height: $full-card-height;
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

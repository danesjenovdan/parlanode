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
      </scroll-shadow>
    </div>
  </card-wrapper>
</template>

<script>
import { max, sum } from 'lodash-es';
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import BarChart from '@/_components/BarChart.vue';
import AttendanceByGroups from '@/_components/AttendanceByGroups.vue';
import ScrollShadow from '@/_components/ScrollShadow.vue';
import VoteListItem from '@/_components/VoteListItem.vue';
import links from '@/_mixins/links.js';
import dateFormatter from '@/_helpers/dateFormatter.js';

export default {
  name: 'CardMiscLastSession',
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
    return {
      session: this.cardData.data?.session || {},
      tfidf: this.cardData.data?.results?.tfidf || [],
      attendance: this.cardData.data?.results?.attendance || [],
      votes: this.cardData.data?.results?.votes || [],
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
  },
  methods: {
    formatDate(date) {
      return dateFormatter(date);
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
}
</style>

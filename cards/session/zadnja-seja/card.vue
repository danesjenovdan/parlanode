<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    max-height
  >
    <div class="smalldate">{{ data.session.date }}</div>
    <hr />
    <div class="link">
      <a
        :href="getSessionTranscriptLink(data.session)"
        class="funblue-light-hover"
      >
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'info.words-heading'"></span>
      </a>
    </div>
    <div v-if="chartRows.length" class="columns">
      <bar-chart :data="chartRows1" :already-calculated="true" />
      <bar-chart :data="chartRows2" :already-calculated="true" />
    </div>
    <hr />
    <div class="link">
      <span class="link-color">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'info.presence-heading'"></span>
      </span>
    </div>
    <prisotnost-po-poslanskih-skupinah :data="data.presence" />
    <hr />
    <div class="link">
      <a :href="getSessionVotesLink(data.session)" class="funblue-light-hover">
        <span class="glyphicon glyphicon-comment"></span>
        <span v-t="'info.votes-heading'"></span>
      </a>
    </div>
    <div class="votes">
      <seznam-glasovanj :data="votes" :show-filters="false" />
    </div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import BarChart from '@/_components/BarChart.vue';
import PrisotnostPoPoslanskihSkupinah from '@/_components/PrisotnostPoPoslanskihSkupinah.vue';
import SeznamGlasovanj from '@/_components/SeznamGlasovanj.vue';
import links from '@/_mixins/links.js';

export default {
  name: 'CardSessionZadnjaSeja',
  components: {
    BarChart,
    SeznamGlasovanj,
    PrisotnostPoPoslanskihSkupinah,
  },
  mixins: [common, sessionHeader, sessionOgImage, links],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    return {
      data: this.$options.contextData.cardData,
    };
  },
  computed: {
    chartRows() {
      // JSON.parse(JSON.stringify(this.data.results));
      const rows = this.data.tfidf.results.map((row) => {
        row.value = Math.round(row.scores['tf-idf'] * 5000);
        return row;
      });

      const mymax = this.data.tfidf.results.reduce(
        (acc, row) => Math.max(acc, row.value),
        0
      );
      const mytotal = this.data.tfidf.results.reduce(
        (acc, row) => acc + row.value,
        0
      );

      return rows
        .map((row) => ({
          name: this.decodeHTML(row.term),
          value: row.value,
          link: this.getSearchTermLink(row.term),
          widthPercentage: (row.value / mymax) * 100,
          percentage: ((row.value / mytotal) * 100).toFixed(2),
        }))
        .sort((a, b) => b.value - a.value);
    },
    chartRows1() {
      return this.chartRows.slice(0, 5);
    },
    chartRows2() {
      return this.chartRows.slice(5, 10);
    },
    votes() {
      return {
        votes: this.data.motions.map((motion) => motion.results),
        session: this.data.session,
        tags: this.data.motions
          .map((motion) => motion.results.tags)
          .reduce((acc, cur) => {
            acc.push(...cur);
            return acc;
          }, []),
      };
    },
    generatedCardUrl() {
      return `${this.url}?altHeader=true`;
    },
  },
  methods: {
    decodeHTML(html) {
      return html.replace('&shy;', '\u00AD');
    },
  },
};
</script>

<style lang="scss" scoped>
@import 'parlassets/scss/breakpoints';
@import 'parlassets/scss/colors';

hr,
.link {
  margin-top: 10px;
  margin-bottom: 10px;
  text-transform: uppercase;
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

      :deep(column-label) {
        flex: 0 0 33%;

        .chart-label {
          word-break: break-word;
        }
      }

      :deep(column-bar) {
        flex: 0 0 66%;
      }
    }

    .word-list + .word-list {
      margin-top: -10px;
    }
  }
}

.votes {
  min-height: 40px;

  :deep(votingCard) {
    height: auto !important;
    max-height: 500px;
  }
}

.link-color {
  color: $link;
}
</style>

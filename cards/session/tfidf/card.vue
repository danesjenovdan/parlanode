<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig" max-height>
    <div v-if="chartRows.length" class="columns">
      <bar-chart :data="chartRows1" :already-calculated="true" />
      <bar-chart :data="chartRows2" :already-calculated="true" />
    </div>
    <!-- TODO: this should be empty state -->
    <div v-else v-t="'session-processing'" class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import BarChart from '@/_components/BarChart.vue';
import links from '@/_mixins/links.js';

export default {
  name: 'CardSessionTfidf',
  components: {
    BarChart,
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
      const rows = this.data.results.map((row) => {
        row.value = Math.round(row.scores['tf-idf'] * 5000);
        return row;
      });

      const mymax = this.data.results.reduce(
        (acc, row) => Math.max(acc, row.value),
        0
      );
      const mytotal = this.data.results.reduce(
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
  },
  created() {
    // TODO:
    // this.$options.cardData.template.contextUrl = this.getSessionTranscriptLink(
    //   this.data.session
    // );
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

.empty-dataset {
  font-size: 16px;
  line-height: 20px;
  margin: 70px 0;
  text-align: center;
  color: $font-placeholder;
}
</style>

<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
      <p v-t="'info.text[1]'" class="info-text"></p>
    </div>

    <div v-if="chartRows.length" class="columns">
      <bar-chart :data="chartRows1" :already-calculated="true" />
      <bar-chart :data="chartRows2" :already-calculated="true" />
    </div>
    <div v-t="'session-processing'" v-else class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common';
import { sessionHeader } from '@/_mixins/altHeaders';
import { sessionOgImage } from '@/_mixins/ogImages';
import BarChart from '@/_components/BarChart.vue';
import links from '@/_mixins/links';

export default {
  name: 'BesedeKiSoZaznamovaleSejo',
  components: {
    BarChart,
  },
  mixins: [
    common,
    sessionHeader,
    sessionOgImage,
    links,
  ],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    chartRows() {
      // JSON.parse(JSON.stringify(this.data.results));
      const rows = this.data.results
        .map((row) => {
          row.value = Math.round(row.scores['tf-idf'] * 5000);
          return row;
        });

      const mymax = this.data.results.reduce((acc, row) => Math.max(acc, row.value), 0);
      const mytotal = this.data.results.reduce((acc, row) => acc + row.value, 0);

      return rows
        .map(row => ({
          name: this.decodeHTML(row.term),
          value: row.value,
          link: this.getSearchTermLink(row.term),
          widthPercentage: (row.value / mymax) * (this.showNumbers ? 80 : 100),
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
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.session.id}?altHeader=true`;
    },
  },
  created() {
    this.$options.cardData.template.contextUrl = this.getSessionTranscriptLink(this.data.session);
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

      ::v-deep .column-label {
        flex: 0 0 33%;

        .chart-label {
          word-break: break-word;
        }
      }

      ::v-deep .column-bar {
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

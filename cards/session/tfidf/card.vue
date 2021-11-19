<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <div v-if="chartRows.length" class="columns">
      <bar-chart :data="chartRows1" :max="max" :total="total" />
      <bar-chart :data="chartRows2" :max="max" :total="total" />
    </div>
    <!-- TODO: this should be empty state -->
    <div v-else v-t="'session-processing'" class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import { max, sum } from 'lodash-es';
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import { sessionTranscriptContextUrl } from '@/_mixins/contextUrls.js';
import BarChart from '@/_components/BarChart.vue';
import links from '@/_mixins/links.js';

export default {
  name: 'CardSessionTfidf',
  components: {
    BarChart,
  },
  mixins: [
    common,
    sessionTranscriptContextUrl,
    sessionHeader,
    sessionOgImage,
    links,
  ],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const { cardData } = this.$root.$options.contextData;

    return {
      results: cardData?.data?.results || [],
    };
  },
  computed: {
    max() {
      return max(this.results.map((item) => item.value || 0)) * 5000;
    },
    total() {
      return sum(this.results.map((item) => item.value || 0)) * 5000;
    },
    chartRows() {
      return this.results.map((item) => ({
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

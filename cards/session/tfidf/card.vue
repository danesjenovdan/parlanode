<template>
  <card-wrapper :header-config="headerConfig" max-height>
    <empty-state v-if="!chartRows.length" />
    <div v-else class="columns">
      <bar-chart :data="chartRows1" :max="max" :total="total" />
      <bar-chart :data="chartRows2" :max="max" :total="total" />
    </div>
  </card-wrapper>
</template>

<script>
import { max, sum } from 'lodash-es';
import common from '@/_mixins/common.js';
import { sessionHeader } from '@/_mixins/altHeaders.js';
import { sessionOgImage } from '@/_mixins/ogImages.js';
import { sessionTranscriptContextUrl } from '@/_mixins/contextUrls.js';
import links from '@/_mixins/links.js';
import BarChart from '@/_components/BarChart.vue';
import EmptyState from '@/_components/EmptyState.vue';

export default {
  name: 'CardSessionTfidf',
  components: {
    BarChart,
    EmptyState,
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
        link: this.getSearchTermLink(item.token),
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

:deep(.card-content) {
  height: 265px;

  @include respond-to(mobile) {
    height: auto;
  }
}

:deep(.card-content-front) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.columns {
  display: flex;
  gap: 20px;
  width: 100%;

  @include respond-to(mobile) {
    flex-direction: column;
    gap: 0;
  }

  .word-list {
    flex: 1 1 auto;

    @include respond-to(mobile) {
      &:first-child {
        margin-bottom: 0;
      }

      &:last-child {
        margin-top: -10px;
      }

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
  }
}
</style>

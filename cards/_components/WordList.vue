<template>
  <div class="word-list">
    <div class="labeled-chart">
      <div class="column chart-label">
        <div
          v-for="item in items"
          :key="item.term"
          class="label-container">
          <a :href="getSearchLink(item.term)" class="funblue-light-hover">
            {{ item.term }}
          </a>
        </div>
      </div>
      <div class="column chart">
        <div
          v-for="item in items"
          :key="`${item.term}-chart`"
          class="progress hugebar">
          <div
            role="progressbar"
            class="progress-bar funblue"
            :style="`width: ${getScore(item.scores)}%`">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { SEARCH_ROOT_URL } from 'components/constants';

const getNormalizedScore = scores =>
  Math.round(scores['tf-idf'] * 5000);

export default {
  name: 'WordList',
  props: {
    items: {
      type: Array,
      required: true,
    },
  },
  computed: {
    maxScore() {
      return this.items.reduce(
        (max, current) => Math.max(max, getNormalizedScore(current.scores)),
        0,
      );
    },
  },
  methods: {
    getSearchLink(term) {
      return SEARCH_ROOT_URL + encodeURIComponent(`"${term}"`);
    },
    getScore(scores) {
      const score = (getNormalizedScore(scores) / this.maxScore) * 100;
      return Math.max(1, score);
    },
  },
};
</script>

<style lang="scss" scoped>
.word-list {
  max-height: 480px;
  overflow: hidden;

  .labeled-chart {
    padding: 0;
    line-height: 1.3em;

    .column {
      &.chart-label {
        flex: 1;
        .label-container {
          align-items: center;
          display: flex;
          height: 48px;
        }
      }

      &.chart {
        flex: 4;
        .progress {
          padding: 9px 0;
          height: 48px;
        }
      }
    }
  }
}
</style>

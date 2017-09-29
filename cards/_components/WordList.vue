<template>
  <bar-chart :data="chartRows" already-calculated />
</template>

<script>
import { SEARCH_ROOT_URL } from 'components/constants';
import BarChart from 'components/BarChart.vue';

const getNormalizedScore = scores =>
  Math.round(scores['tf-idf'] * 5000);

export default {
  name: 'WordList',
  components: { BarChart },
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
    chartRows() {
      return this.items.map(item => ({
        name: item.term,
        widthPercentage: this.getScore(item.scores),
        link: this.getSearchLink(item.term),
      }));
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

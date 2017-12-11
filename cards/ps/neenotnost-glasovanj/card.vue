<template>
  <score-avg-max
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :person="$options.cardData.data.person"
    :results="getResults"
    :info-text="infoText"
    v-bind="{ generatedCardUrl }"></score-avg-max>
</template>

<script>
import urlFunctionalities from 'mixins/urlFunctionalities';
import ScoreAvgMax from 'components/ScoreAvgMax.vue';

export default {
  components: { ScoreAvgMax },
  mixins: [ urlFunctionalities ],
  name: 'NeenotnostGlasovanj',
  data() {
    const infoText = '';
    return {
      infoText,
      urlParameters: {},
    }
  },
  computed: {
    getResults() {
      return { sessions: this.$options.cardData.data.results }
    }
  },
  methods: {
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

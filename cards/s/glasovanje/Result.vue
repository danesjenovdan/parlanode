<template>
  <div class="result">
    <donut-chart
      class="donut-chart"
      :section-data="chartData"
    />
    <div class="percentage">{{ Math.round(this.score) }} %</div>
    <div class="text">{{ translatedOption }}</div>
  </div>
</template>

<script>
import DonutChart from 'components/DonutChart.vue';

export default {
  name: 'GlasovanjeSeje_Result',
  components: { DonutChart },
  data() {
    return {
      votes: [
        { id: 'for', label: 'za' },
        { id: 'against', label: 'proti' },
        { id: 'abstain', label: 'vzdržani' },
        { id: 'not_present', label: 'niso' },
      ],
    };
  },
  computed: {
    translatedOption() {
      // TODO: Include all options and ask about translations
      return {
        for: 'za',
        against: 'proti',
        absent: 'odsotnih',
        abstain: 'vzdržanih',
      }[this.option];
    },
  },
  props: {
    chartData: Array,
    option: String,
    score: Number,
  },
};
</script>

<style lang="sass">
@import 'parlassets/scss/colors';

.result {
  align-items: center;
  display: flex;
  justify-content: flex-end;

  .donut-chart {
    height: 61px;
    margin-left: 40px;
    width: 61px;
  }

  .percentage {
    font-size: 30px;
    margin-left: 18px;
    white-space: nowrap;
  }

  .text {
    font-size: 16px;
    text-transform: uppercase;
    margin-left: 12px;
  }
}
</style>

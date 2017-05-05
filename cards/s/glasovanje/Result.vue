<template>
  <div class="result">
    <donut-chart
      :class="['donut-chart', `option-${this.option}`]"
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
    background-size: 41px 41px;
    background-repeat: no-repeat;
    background-position: center center;
    height: 61px;
    margin-left: 40px;
    width: 61px;

    $icon-path: 'https://cdn.parlameter.si/v1/parlassets/icons';
    &.option-for { background-image: url(#{$icon-path}/za_v2.svg) }
    &.option-against { background-image: url(#{$icon-path}/proti_v2.svg) }
    &.option-not_present { background-image: url(#{$icon-path}/ni.svg) }
    &.option-abstain { background-image: url(#{$icon-path}/vzdrzan_v2.svg) }
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

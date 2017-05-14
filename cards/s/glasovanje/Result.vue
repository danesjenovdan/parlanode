<template>
  <div class="result">
    <donut-chart
      :class="['donut-chart', `option-${option}`]"
      :section-data="chartData"
    />
    <div v-if="option !== 'cant_compute'" class="percentage">{{ Math.round(score) }} %</div>
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
        not_present: 'odsotnih',
        abstain: 'vzdržanih',
        cant_compute: 'ni večinskega glasu',
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

<style lang="scss" scoped>
@import '~parlassets/scss/colors';
@import '~parlassets/scss/breakpoints';

.result {
  align-items: center;
  display: flex;
  justify-content: flex-end;
  @include respond-to(desktop) { justify-content: flex-start; }

  .donut-chart {
    @include show-for(desktop);
    background-size: 41px 41px;
    background-repeat: no-repeat;
    background-position: center center;
    height: 58px;
    margin: 0 8px 0 40px;
    width: 58px;

    $icon-path: 'https://cdn.parlameter.si/v1/parlassets/icons';
    &.option-for { background-image: url(#{$icon-path}/za_v2.svg) }
    &.option-against { background-image: url(#{$icon-path}/proti_v2.svg) }
    &.option-not_present { background-image: url(#{$icon-path}/ni.svg) }
    &.option-abstain { background-image: url(#{$icon-path}/vzdrzan_v2.svg) }
  }

  .percentage {
    font-size: 24px;
    white-space: nowrap;
    @include respond-to(desktop) {
      margin-left: 10px;
      font-size: 30px;
    }
  }

  .text {
    font-size: 13px;
    text-transform: uppercase;
    margin-left: 12px;
    max-width: 140px;
    @include respond-to(desktop) { font-size: 16px; }
  }
}
</style>

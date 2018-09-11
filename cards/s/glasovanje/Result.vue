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
  name: 'GlasovanjeSejeResult',
  components: {
    DonutChart,
  },
  props: {
    chartData: {
      type: Array,
      default: () => [],
    },
    option: {
      type: String,
      default: '',
    },
    score: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    translatedOption() {
      switch (this.option) {
        case 'for':
          return this.$t('vote-for');
        case 'against':
          return this.$t('vote-against');
        case 'abstain':
          return this.$t('vote-abstain-plural');
        case 'absent':
          return this.$t('vote-absent-plural');
        default:
          return '';
      }
    },
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

    $icon-path: "#{getConfig('urls.cdn')}/icons";
    &.option-for { background-image: url(#{$icon-path}/za_v2.svg) }
    &.option-against { background-image: url(#{$icon-path}/proti_v2.svg) }
    &.option-absent { background-image: url(#{$icon-path}/ni.svg) }
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
    line-height: 34px;
    margin-left: 12px;
    max-width: 140px;
    text-transform: uppercase;
    @include respond-to(desktop) {
      font-size: 16px;
      line-height: 23px;
    }
  }
}
</style>

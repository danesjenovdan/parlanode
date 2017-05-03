<template>
  <div class="result">
    <div class="donut-chart"></div>
    <div class="percentage">{{ Math.round(this.score) }} %</div>
    <div class="text">{{ translatedOption }}</div>
  </div>
</template>

<script>
export default {
  name: 'GlasovanjeSeje_Result',
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
    score: Number,
    option: String,
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
    border-radius: 50%;
    border: 9px solid $funblue;
    height: 61px;
    width: 61px;
    margin-left: 40px;
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

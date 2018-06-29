<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <stacked-bar-chart :data="rows"></stacked-bar-chart>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import StackedBarChart from 'components/StackedBarChart.vue';

export default {
  name: 'ObcasnikUspesnostAmandmajev',
  components: {
    StackedBarChart,
  },
  mixins: [common],
  data() {
    const data = this.$options.cardData.data;
    const parties = ['SDS', 'SMC', 'Levica', 'DeSUS', 'NP', 'SD', 'NSi', 'IMNS']; // PAZI NA PS NP vs. NP

    const rows = parties.map((acronym) => {
      const successful = data
        .filter(e => e.acronym === acronym)
        .filter(e => e.result)
        .length;

      const unsuccessful = data
        .filter(e => e.acronym === acronym)
        .filter(e => !e.result)
        .length;

      return {
        name: data.filter(e => e.acronym === acronym)[0].orgData.acronym,
        acronym: data.filter(e => e.acronym === acronym)[0].orgData.acronym,
        stack: [
          {
            label: 'uspešnih',
            value: successful,
          },
          {
            label: 'neuspešnih',
            value: unsuccessful,
          },
        ],
      };
    });

    return {
      data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      rows,
      generatedCardUrl: `${this.url}?state={}`,
    };
  },
  methods: {
    focusTab() {
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

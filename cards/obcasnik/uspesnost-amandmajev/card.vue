<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >

    <div slot="info">
      <p class="info-text lead"></p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text"></p>
    </div>

    <stacked-bar-chart :data="rows" />
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
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
      headerConfig: defaultHeaderConfig(this),
      ogConfig: defaultOgImage(this),
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

<template>
  <ul class="party-list">
    <li v-if="processedPartyData.length === 0" class="loader">
      <div class="nalagalnik"></div>
    </li>
    <li
      v-for="(party, index) in processedPartyData"
      :key="index"
      class="labeled-chart"
    >
      <div class="column chart-label">
        <a :href="getPartyLink(party)" class="funblue-light-hover">
          {{ party.acronym || party.name || 'N/A' }}
        </a>
      </div>
      <div class="column chart">
        <div class="progress hugebar">
          <div
            :style="{ width: party.chartWidth }"
            class="progress-bar funblue"
            role="progressbar"
          ></div>
          <div class="progress_number">{{ party.displayValue }}</div>
        </div>
      </div>
    </li>
  </ul>
</template>

<script>
import links from '@/_mixins/links.js';

export default {
  name: 'SeznamPoslanskihSkupinInnerCard',
  mixins: [links],
  props: {
    processedPartyData: {
      type: Array,
      default: () => [],
    },
  },
};
</script>

<style lang="scss" scoped>
.party-list .labeled-chart .column.chart-label {
  line-height: 1.1;
  margin-top: -10px;
  margin-bottom: -10px;
}
</style>

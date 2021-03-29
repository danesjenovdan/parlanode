<template>
  <card-wrapper
    :id="$root.$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <template #info>
      <p class="info-text lead" v-text="currentAnalysisData.title"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p class="info-text" v-html="currentAnalysisData.explanation"></p>
    </template>

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
          <a :href="getPartyLink(party.party)" class="funblue-light-hover">
            {{ party.party.acronym }}
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
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common';
import links from '@/_mixins/links';
import { partyList } from '@/_mixins/contextUrls';

export default {
  name: 'SeznamPoslanskihSkupinInnerCard',
  mixins: [common, links, partyList],
  props: {
    processedPartyData: {
      type: Array,
      default: () => [],
    },
    headerConfig: {
      type: Object,
      default: () => ({}),
    },
    ogConfig: {
      type: Object,
      default: null,
    },
    generatedCardUrl: {
      type: String,
      default: '',
    },
    currentAnalysisData: {
      type: Object,
      default: () => ({}),
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

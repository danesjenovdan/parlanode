<template>
  <div class="card-container card-halfling card-seznam-poslanskih-skupin">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <ul class="party-list">
          <li v-if="processedPartyData.length === 0" class="loader">
            <div class="nalagalnik"></div>
          </li>
          <li v-for="(party, index) in processedPartyData" class="labeled-chart" :key="index">
            <div class="column chart-label">
              <a class="funblue-light-hover" :href="getPartyUrl(party.party)">{{ party.party.acronym }}</a>
            </div>
            <div class="column chart">
              <div class="progress hugebar">
                <div class="progress-bar funblue" role="progressbar" :style="{ width: party.chartWidth }"></div>
                <div class="progress_number">{{ party.displayValue }}</div>
              </div>
            </div>
          </li>
        </ul>
      </div>

      <card-info>
        <p class="info-text lead">Seznam poslanskih skupin glede na rezultate analize {{currentAnalysisData.titleSuffix}}</p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text" v-html="currentAnalysisData.explanation"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="generatedCardUrl" />
    </div>
    <card-footer />
  </div>
</template>

<script>
import common from 'mixins/common';

export default {
  mixins: [common],
  name: 'SeznamPoslanskihSkupinInnerCard',
  props: {
    processedPartyData: Array,
    getPartyUrl: Function,
    headerConfig: Object,
    generatedCardUrl: String,
    currentAnalysisData: Object,
  },
};
</script>

<template>
  <card-wrapper
    class="card-halfling card-seznam-poslanskih-skupin"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Seznam poslanskih skupin glede na rezultate analize {{currentAnalysisData.titleSuffix}}</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text" v-html="currentAnalysisData.explanation"></p>
    </div>

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
  </card-wrapper>
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

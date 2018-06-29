<template>
  <card-wrapper
    :id="$root.$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >

    <div slot="info">
      <p class="info-text lead">Seznam poslanskih skupin glede na rezultate analize {{ currentAnalysisData.titleSuffix }}</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text" v-html="currentAnalysisData.explanation"></p>
    </div>

    <ul class="party-list">
      <li v-if="processedPartyData.length === 0" class="loader">
        <div class="nalagalnik"></div>
      </li>
      <li v-for="(party, index) in processedPartyData" :key="index" class="labeled-chart">
        <div class="column chart-label">
          <a :href="getPartyLink(party.party)" class="funblue-light-hover">{{ party.party.acronym }}</a>
        </div>
        <div class="column chart">
          <div class="progress hugebar">
            <div :style="{ width: party.chartWidth }" class="progress-bar funblue" role="progressbar"></div>
            <div class="progress_number">{{ party.displayValue }}</div>
          </div>
        </div>
      </li>
    </ul>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { getPartyLink } from 'components/links';

export default {
  name: 'SeznamPoslanskihSkupinInnerCard',
  mixins: [common],
  props: {
    processedPartyData: Array,
    headerConfig: Object,
    generatedCardUrl: String,
    currentAnalysisData: Object,
  },
  created() {
    this.$root.$options.cardData.template.contextUrl = `${this.slugs.urls.base}/poslanske-skupine`;
  },
  methods: {
    getPartyLink,
  },
};
</script>

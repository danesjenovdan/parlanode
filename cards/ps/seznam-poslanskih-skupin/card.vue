<template>
  <div
    v-if="$options.cardData.parlaState && $options.cardData.parlaState.generator"
    :id="$options.cardData.cardData._id">
    <div class="party-list-generator">
      <div class="row">
        <div class="col-md-12">
          <blue-button-list
            :items="analyses"
            v-model="currentAnalysis" />
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <inner-card v-bind="{ processedPartyData, getPartyUrl, headerConfig, generatedCardUrl, currentAnalysisData }" />
        </div>
      </div>
    </div>
  </div>
  <inner-card v-else v-bind="{ processedPartyData, getPartyUrl, headerConfig, generatedCardUrl, currentAnalysisData }" />
</template>

<script>
import { find, get } from 'lodash';
import urlFunctionalities from 'mixins/urlFunctionalities';
import BlueButtonList from 'components/BlueButtonList.vue';
import analyses from './analyses.json';
import InnerCard from './InnerCard.vue';

export default {
  name: 'SeznamPoslanskihSkupin',
  components: { BlueButtonList, InnerCard },
  mixins: [urlFunctionalities],
  data() {
    return {
      data: this.$options.cardData.data.data,
      currentAnalysis: this.$options.cardData.parlaState.analysis || 'seat_count',
      analyses,
    };
  },
  computed: {
    headerConfig() {
      return {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: `${this.$options.cardData.cardData.name} ${this.currentAnalysisData.titleSuffix}`,
      };
    },
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    processedPartyData() {
      const maxValue = this.data.reduce((oldValue, nextParty) =>
        Math.max(oldValue, nextParty.results[this.currentAnalysis]),
      0);

      return this.data.map((party) => {
        const rawValue = party.results[this.currentAnalysis];
        const newParty = JSON.parse(JSON.stringify(party));
        newParty.displayValue = (this.round(rawValue, this.currentAnalysisData.roundingPrecision || 1) + (this.currentAnalysisData.unit === 'percent' ? '%' : '')).replace('.', ',');
        newParty.chartWidth = rawValue ? `${(rawValue / maxValue) * 80}%` : '1px';
        return newParty;
      });
    },
    urlParameters() {
      const params = {};
      if (this.currentAnalysis !== 'seat_count') {
        params.analysis = this.currentAnalysis;
      }
      return params;
    },
  },
  methods: {
    round(value, precision) {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    },
    getPartyUrl(party) {
      return this.slugs
        ? this.slugs.base + this.slugs.partyLink.base +
          this.slugs.party[party.id].acronym + this.slugs.partyLink.pregled
        : `/poslanska-skupina/${party.acronym.toLowerCase()}/pregled`;
    },
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },
  },
};
</script>

<template>
  <div
    v-if="$options.cardData.parlaState && $options.cardData.parlaState.generator"
    :id="$options.cardData.cardData._id"
  >
    <div class="party-list-generator">
      <div class="row">
        <div class="col-md-12">
          <blue-button-list
            :items="analyses"
            v-model="currentAnalysis"
          />
        </div>
      </div>

      <div class="row">
        <div class="col-md-12">
          <inner-card
            :processed-party-data="processedPartyData"
            :header-config="headerConfig"
            :og-config="ogConfig"
            :generated-card-url="generatedCardUrl"
            :current-analysis-data="currentAnalysisData"
          />
        </div>
      </div>
    </div>
  </div>
  <inner-card
    v-else
    :processed-party-data="processedPartyData"
    :header-config="headerConfig"
    :og-config="ogConfig"
    :generated-card-url="generatedCardUrl"
    :current-analysis-data="currentAnalysisData"
  />
</template>

<script>
import { find } from 'lodash';
import common from 'mixins/common';
import { defaultHeaderConfig } from 'mixins/altHeaders';
import { defaultOgImage } from 'mixins/ogImages';
import BlueButtonList from 'components/BlueButtonList.vue';
import InnerCard from './InnerCard.vue';

const analysesIDs = [
  {
    id: 'seat_count',
  },
  {
    id: 'presence_sessions',
    unit: 'percent',
  },
  {
    id: 'presence_votes',
    unit: 'percent',
  },
  {
    id: 'number_of_questions',
    round: true,
    roundingPrecision: 0,
  },
  {
    id: 'vocabulary_size',
  },
  {
    id: 'privzdignjeno',
    roundingPrecision: 3,
  },
  {
    id: 'preprosto',
    roundingPrecision: 3,
  },
  {
    id: 'problematicno',
    roundingPrecision: 3,
  },
];

export default {
  name: 'SeznamPoslanskihSkupin',
  components: {
    BlueButtonList,
    InnerCard,
  },
  mixins: [
    common,
  ],
  data() {
    const analyses = analysesIDs.map(a => ({
      id: a.id,
      label: this.$te(`analysis-texts.${a.id}.label`) ? this.$t(`analysis-texts.${a.id}.label`) : '',
      titleSuffix: this.$te(`analysis-texts.${a.id}.titleSuffix`) ? this.$t(`analysis-texts.${a.id}.titleSuffix`) : '',
      explanation: this.$te(`analysis-texts.${a.id}.explanation`) ? this.$t(`analysis-texts.${a.id}.explanation`) : '',
    }));

    return {
      data: this.$options.cardData.data.data,
      currentAnalysis: this.$options.cardData.parlaState.analysis || 'seat_count',
      analyses,
    };
  },
  computed: {
    headerConfig() {
      return defaultHeaderConfig(this, {
        title: `${this.$t('card.title')} ${this.currentAnalysisData.titleSuffix}`,
      });
    },
    ogConfig() {
      return defaultOgImage(this, {
        title: `${this.$t('card.title')} ${this.currentAnalysisData.titleSuffix}`,
      });
    },
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    processedPartyData() {
      const maxValue = this.data.reduce((oldValue, nextParty) => (
        Math.max(oldValue, nextParty.results[this.currentAnalysis])
      ), 0);

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
    generatedCardUrl() {
      const state = `${Object.keys(this.urlParameters).length > 0 ? `&state=${encodeURIComponent(JSON.stringify(this.urlParameters))}` : ''}`;
      return `${this.url}?altHeader=true${state}`;
    },
  },
  methods: {
    round(value, precision) {
      const multiplier = 10 ** (precision || 0);
      return Math.round(value * multiplier) / multiplier;
    },
  },
};
</script>

<template>
  <card-wrapper :header-config="headerConfig" :og-config="ogConfig" max-height>
    <template #generator>
      <div class="party-list-generator">
        <div class="row">
          <div class="col-md-12">
            <blue-button-list v-model="currentAnalysis" :items="analyses" />
          </div>
        </div>
      </div>
    </template>
    <inner-card
      :processed-party-data="processedPartyData"
      :header-config="headerConfig"
      :og-config="ogConfig"
      :current-analysis-data="currentAnalysisData"
    />
  </card-wrapper>
</template>

<script>
import { find } from 'lodash-es';
import common from '@/_mixins/common.js';
import { defaultHeaderConfig } from '@/_mixins/altHeaders.js';
import { defaultOgImage } from '@/_mixins/ogImages.js';
import BlueButtonList from '@/_components/BlueButtonList.vue';
import InnerCard from './InnerCard.vue';

const analysesIDs = [
  {
    id: 'seat_count',
  },
  // {
  //   id: 'presence_sessions',
  //   unit: 'percent',
  // },
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
    id: 'number_of_amendments',
    round: true,
    roundingPrecision: 0,
  },
  {
    id: 'intra_disunion',
    round: true,
    roundingPrecision: 2,
  },
  {
    id: 'vocabulary_size',
  },
  // {
  //   id: 'privzdignjeno',
  //   roundingPrecision: 3,
  // },
  // {
  //   id: 'preprosto',
  //   roundingPrecision: 3,
  // },
  // {
  //   id: 'problematicno',
  //   roundingPrecision: 3,
  // },
];

export default {
  name: 'CardMiscGroups',
  components: {
    BlueButtonList,
    InnerCard,
  },
  mixins: [common],
  cardInfo: {
    doubleWidth: true,
  },
  data() {
    const analyses = analysesIDs.map((a) => ({
      ...a,
      label: this.$te(`analysis-texts.${a.id}.label`)
        ? this.$t(`analysis-texts.${a.id}.label`)
        : '',
      titleSuffix: this.$te(`analysis-texts.${a.id}.titleSuffix`)
        ? this.$t(`analysis-texts.${a.id}.titleSuffix`)
        : '',
      explanation: this.$te(`analysis-texts.${a.id}.explanation`)
        ? this.$t(`analysis-texts.${a.id}.explanation`)
        : '',
    }));

    return {
      results: this.cardData.data?.results || [],
      currentAnalysis: this.cardState.analysis || 'seat_count',
      analyses,
    };
  },
  computed: {
    headerConfig() {
      return defaultHeaderConfig(this, {
        title: `${this.$t('card.title')} ${
          this.currentAnalysisData.titleSuffix
        }`,
      });
    },
    ogConfig() {
      return defaultOgImage(this, {
        title: `${this.$t('card.title')} ${
          this.currentAnalysisData.titleSuffix
        }`,
      });
    },
    currentAnalysisData() {
      return find(this.analyses, { id: this.currentAnalysis });
    },
    processedPartyData() {
      const maxValue = this.results.reduce(
        (oldValue, nextParty) =>
          Math.max(oldValue, nextParty.results?.[this.currentAnalysis]),
        0
      );

      return this.results.map((party) => {
        const rawValue = party.results?.[this.currentAnalysis];
        const newParty = JSON.parse(JSON.stringify(party));
        newParty.displayValue = (
          this.round(
            rawValue,
            this.currentAnalysisData.roundingPrecision || 1
          ) + (this.currentAnalysisData.unit === 'percent' ? '%' : '')
        ).replace('.', ',');
        newParty.chartWidth = rawValue
          ? `${(rawValue / maxValue) * 80}%`
          : '1px';
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
  },
};
</script>

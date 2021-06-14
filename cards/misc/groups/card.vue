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
import stableSort from 'stable';
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
    id: 'vote_attendance',
    unit: 'percent',
  },
  {
    id: 'number_of_questions',
    roundingPrecision: 0,
  },
  {
    id: 'number_of_amendments',
    roundingPrecision: 0,
  },
  {
    id: 'intra_disunion',
    roundingPrecision: 2,
  },
  {
    id: 'vocabulary_size',
    roundingPrecision: 2,
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
      label: this.$te(`analysis-texts--party.${a.id}.label`)
        ? this.$t(`analysis-texts--party.${a.id}.label`)
        : '',
      titleSuffix: this.$te(`analysis-texts--party.${a.id}.titleSuffix`)
        ? this.$t(`analysis-texts--party.${a.id}.titleSuffix`)
        : '',
      explanation: this.$te(`analysis-texts--party.${a.id}.explanation`)
        ? this.$t(`analysis-texts--party.${a.id}.explanation`)
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

      function formatNumberWithPrecision(number, precision) {
        const min = 10 ** -precision;
        if (number > 0 && number < min) {
          return `< ${min.toFixed(precision).replace('.', ',')}`;
        }
        return number.toFixed(precision).replace('.', ',');
      }

      const mappedData = this.results.map((party) => {
        const rawValue = party.results?.[this.currentAnalysis];
        const newParty = JSON.parse(JSON.stringify(party));

        newParty.displayValue =
          formatNumberWithPrecision(
            rawValue ?? 0,
            this.currentAnalysisData.roundingPrecision || 0
          ) + (this.currentAnalysisData.unit === 'percent' ? ' %' : '');

        newParty.chartWidth = rawValue
          ? `${(rawValue / maxValue) * 80}%`
          : '1px';

        return newParty;
      });

      return stableSort(mappedData, (memberA, memberB) => {
        const a = memberA.results?.[this.currentAnalysis] || 0;
        const b = memberB.results?.[this.currentAnalysis] || 0;
        return b - a;
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
};
</script>

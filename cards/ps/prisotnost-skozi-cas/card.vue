<template>
  <prisotnost-chart
    :card-data="$root.$options.cardData"
    :party="$root.$options.cardData.data.party"
    :results="$root.$options.cardData.data.results"
    :generated-card-url="generatedCardUrl"
    type="party"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>
  </prisotnost-chart>
</template>

<script>
import common from 'mixins/common';
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
import PrisotnostChart from 'components/PrisotnostChart.vue';

export default {
  name: 'PrisotnostSkoziCas',
  components: {
    PrisotnostChart,
  },
  mixins: [
    common,
    partyOverview,
    partyTitle,
  ],
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$root.$options.cardData.data.party.id}?altHeader=true`;
    },
  },
};
</script>

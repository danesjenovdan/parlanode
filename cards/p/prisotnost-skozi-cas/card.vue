<template>
  <prisotnost-chart
    :card-data="$options.cardData"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
    :generated-card-url="generatedCardUrl"
    type="person"
  >
    <template #info>
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </template>
  </prisotnost-chart>
</template>

<script>
import common from '@/_mixins/common.js';
import { memberOverview } from '@/_mixins/contextUrls.js';
import { memberTitle } from '@/_mixins/titles.js';
import PrisotnostChart from '@/_components/PrisotnostChart.vue';

export default {
  name: 'PrisotnostSkoziCas',
  components: {
    PrisotnostChart,
  },
  mixins: [common, memberOverview, memberTitle],
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.person.id}?altHeader=true`;
    },
  },
};
</script>

<template>
  <prisotnost-chart
    :card-data="$root.$options.cardData"
    :person="$root.$options.cardData.data.person"
    :results="$root.$options.cardData.data.results"
    :generated-card-url="generatedCardUrl"
    type="person"
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
import { memberOverview } from 'mixins/contextUrls';
import { memberTitle } from 'mixins/titles';
import PrisotnostChart from 'components/PrisotnostChart.vue';

export default {
  name: 'PrisotnostSkoziCas',
  components: {
    PrisotnostChart,
  },
  mixins: [
    common,
    memberOverview,
    memberTitle,
  ],
  computed: {
    generatedCardUrl() {
      return `${this.url}${this.$root.$options.cardData.data.person.id}?altHeader=true`;
    },
  },
};
</script>

<template>
  <prisotnost-chart
    :card-data="$options.cardData"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
    v-bind="{ generatedCardUrl }"
    type="poslanec"
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
import urlFunctionalities from 'mixins/urlFunctionalities';
import PrisotnostChart from 'components/PrisotnostChart.vue';

export default {
  name: 'PrisotnostSkoziCas',
  components: {
    PrisotnostChart,
  },
  mixins: [
    common,
    urlFunctionalities,
    memberOverview,
    memberTitle,
  ],
  data() {
    return {
      urlParameters: {},
    };
  },
};
</script>

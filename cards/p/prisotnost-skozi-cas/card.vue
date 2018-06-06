<template>
  <prisotnost-chart
    :card-data="$options.cardData"
    type="poslanec"
    :person="$options.cardData.data.person"
    :results="$options.cardData.data.results"
    v-bind="{ generatedCardUrl }"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text'"></p>
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

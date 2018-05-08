<template>
  <prisotnost-chart
    :card-data="$options.cardData"
    :type="$options.cardData.cardData.type"
    :party="$options.cardData.data.party"
    :results="$options.cardData.data.results"
    v-bind="{ generatedCardUrl }"
  >
    <div slot="info">
      <p class="info-text lead">
        Prisotnost poslanske skupine na glasovanjih DZ skozi čas.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Seštejemo število glasovanj, na katerih bi v izbranem mesecu morali biti prisotni poslanci poslanske skupine, in z odstotki prikažemo, kolikšnega deleža glasovanj so se udeležili.
      </p>
    </div>
  </prisotnost-chart>
</template>

<script>
import common from 'mixins/common';
import { partyOverview } from 'mixins/contextUrls';
import { partyTitle } from 'mixins/titles';
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
    partyOverview,
    partyTitle,
  ],
  data() {
    return {
      urlParameters: {},
    };
  },
};
</script>

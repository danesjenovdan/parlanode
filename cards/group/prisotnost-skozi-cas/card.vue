<template>
  <prisotnost-chart
    :party="$options.contextData.cardData.party"
    :results="$options.contextData.cardData.results"
    type="party"
  />
</template>

<script>
import PrisotnostChart from '@/_components/PrisotnostChart.vue';

export default {
  name: 'CardGroupPrisotnostSkoziCas',
  components: {
    PrisotnostChart,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

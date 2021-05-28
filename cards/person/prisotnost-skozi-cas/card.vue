<template>
  <prisotnost-chart
    :person="$options.contextData.cardData.person"
    :results="$options.contextData.cardData.results"
    type="person"
  />
</template>

<script>
import PrisotnostChart from '@/_components/PrisotnostChart.vue';

export default {
  name: 'CardPersonPrisotnostSkoziCas',
  components: {
    PrisotnostChart,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

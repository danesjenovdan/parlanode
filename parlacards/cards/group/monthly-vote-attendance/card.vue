<template>
  <prisotnost-chart
    :party="$options.contextData.cardData?.data?.group"
    :results="$options.contextData.cardData?.data?.results || []"
    type="party"
  />
</template>

<script>
import PrisotnostChart from '@/_components/PrisotnostChart.vue';

export default {
  name: 'CardGroupMonthlyVoteAttendance',
  components: {
    PrisotnostChart,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

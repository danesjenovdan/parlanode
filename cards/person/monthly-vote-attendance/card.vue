<template>
  <prisotnost-chart
    :person="$options.contextData.cardData?.data?.person"
    :results="$options.contextData.cardData?.data?.results || []"
    type="person"
  />
</template>

<script>
import PrisotnostChart from '@/_components/PrisotnostChart.vue';

export default {
  name: 'CardPersonMonthlyVoteAttendance',
  components: {
    PrisotnostChart,
  },
  cardInfo: {
    doubleWidth: true,
  },
};
</script>

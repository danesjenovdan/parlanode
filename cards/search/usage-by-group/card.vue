<template>
  <card-wrapper :header-config="headerConfig">
    <pie-chart :data="pieData" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { searchContextUrl } from '@/_mixins/contextUrls.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import PieChart from '@/_components/PieChart.vue';

export default {
  name: 'CardSearchUsageByGroup',
  components: {
    PieChart,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContextUrl],
  data() {
    const { cardData } = this.$root.$options.contextData;

    const pieData = cardData?.data?.results || [];
    return {
      pieData,
    };
  },
};
</script>

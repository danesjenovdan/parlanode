<template>
  <card-wrapper :header-config="headerConfig">
    <empty-state v-if="!pieData?.length" />
    <pie-chart v-else :data="pieData" />
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { searchContextUrl } from '@/_mixins/contextUrls.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import PieChart from '@/_components/PieChart.vue';
import EmptyState from '@/_components/EmptyState.vue';

export default {
  name: 'CardSearchUsageByGroup',
  components: {
    PieChart,
    EmptyState,
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

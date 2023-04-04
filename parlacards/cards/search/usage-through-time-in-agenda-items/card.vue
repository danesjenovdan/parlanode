<template>
  <card-wrapper :header-config="headerConfig">
    <p-tabs>
      <p-tab :label="$t('whole-term')">
        <time-chart :data="timeChartData" />
      </p-tab>
      <p-tab :label="$t('last-year')">
        <time-bar-chart :data="timeChartDataYear" />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from '@/_mixins/common.js';
import { searchContextUrl } from '@/_mixins/contextUrls.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import PTabs from '@/_components/Tabs.vue';
import PTab from '@/_components/Tab.vue';
import TimeChart from '@/_components/TimeChart.vue';
import TimeBarChart from '@/_components/TimeBarChart.vue';

export default {
  name: 'CardSearchUsageThroughTimeInAgendaItems',
  components: {
    PTabs,
    PTab,
    TimeChart,
    TimeBarChart,
  },
  cardInfo: {
    doubleWidth: true,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContextUrl],
  data() {
    const { cardData } = this.$root.$options.contextData;

    const data = cardData?.data?.results || [];
    const timeChartData = data.map((o) => {
      const date = new Date(o.timestamp);
      date.setDate(1);
      return {
        date,
        value: o.value,
      };
    });
    const timeChartDataYear = timeChartData.slice(-12);
    return {
      timeChartData,
      timeChartDataYear,
    };
  },
};
</script>

<style lang="scss" scoped>
:deep(.p-tabs) {
  height: 100%;

  .p-tabs-content {
    display: flex;
    align-items: center;

    .tab-content {
      flex-basis: 100%;
    }
  }
}
</style>

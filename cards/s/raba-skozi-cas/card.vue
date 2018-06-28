<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <p class="info-text" v-t="'info.text'"></p>
    </div>

    <p-tabs>
      <p-tab :label="$t('whole-term')">
        <time-line-chart :data="timeChartData" />
      </p-tab>
      <p-tab :label="$t('last-year')">
        <time-bar-chart :data="timeChartData" />
      </p-tab>
    </p-tabs>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';
import PTabs from 'components/Tabs.vue';
import PTab from 'components/Tab.vue';
import TimeLineChart from 'components/TimeLineChart.vue';
import TimeBarChart from 'components/TimeBarChart.vue';

export default {
  components: {
    PTabs,
    PTab,
    TimeLineChart,
    TimeBarChart,
  },
  mixins: [
    common,
    searchTitle,
  ],
  name: 'RabaSkoziCas',
  data() {
    const keywords = this.$options.cardData.data.responseHeader.params.q.split('content_t:')[1];
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-search',
        heading: keywords,
        subheading: 'iskalni niz',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      keywords,
    };
  },
  computed: {
    timeChartData() {
      return this.data.facet_counts.facet_ranges.datetime_dt;
    },
    generatedCardUrl() {
      const customUrl = encodeURIComponent(`${this.slugs.urls.isci}/q/${this.keywords}`);
      return `${this.url}?customUrl=${customUrl}&altHeader=true`;
    },
  },
};
</script>

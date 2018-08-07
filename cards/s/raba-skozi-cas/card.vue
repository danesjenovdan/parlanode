<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="{'is-loading': loading}"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <p-tabs v-if="!loading">
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
import axios from 'axios';
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';
import { searchHeader } from 'mixins/altHeaders';
import { searchOgImage } from 'mixins/ogImages';
import PTabs from 'components/Tabs.vue';
import PTab from 'components/Tab.vue';
import TimeLineChart from 'components/TimeLineChart.vue';
import TimeBarChart from 'components/TimeBarChart.vue';
import stateLoader from 'helpers/stateLoader';

export default {
  name: 'RabaSkoziCas',
  components: {
    PTabs,
    PTab,
    TimeLineChart,
    TimeBarChart,
  },
  mixins: [
    common,
    searchTitle,
    searchHeader,
    searchOgImage,
  ],
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);
    return {
      data: null,
      keywords: loadFromState('query'),
      loading: true,
    };
  },
  computed: {
    timeChartData() {
      return (this.data && this.data.facet_counts.facet_ranges.datetime_dt) || {};
    },
    generatedCardUrl() {
      return `${this.url}?altHeader=true`;
    },
  },
  mounted() {
    const searchUrl = `${this.slugs.urls.isci}/q/${this.keywords}`;
    axios.get(searchUrl)
      .then((res) => {
        this.data = res.data;
        this.loading = false;
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        this.loading = false;
        this.error = true;
      });
  },
};
</script>

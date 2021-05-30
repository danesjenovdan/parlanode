<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :content-class="['full', { 'is-loading': loading }]"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <template #info>
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </template>

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
import common from '@/_mixins/common.js';
import { search as searchContext } from '@/_mixins/contextUrls.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
import PTabs from '@/_components/Tabs.vue';
import PTab from '@/_components/Tab.vue';
import TimeLineChart from '@/_components/TimeLineChart.vue';
import TimeBarChart from '@/_components/TimeBarChart.vue';
import stateLoader from '@/_helpers/stateLoader.js';

export default {
  name: 'CardSRabaSkoziCas',
  components: {
    PTabs,
    PTab,
    TimeLineChart,
    TimeBarChart,
  },
  mixins: [common, searchTitle, searchHeader, searchOgImage, searchContext],
  data() {
    const loadFromState = stateLoader(this.$options.cardData.parlaState);
    return {
      data: null,
      keywords: loadFromState('query'),
      mps: loadFromState('mps') || [],
      pgs: loadFromState('pgs') || [],
      loading: true,
    };
  },
  computed: {
    timeChartData() {
      return (
        (this.data && this.data.facet_counts.facet_ranges.start_time) || {}
      );
    },
    generatedCardUrl() {
      const state = {};

      if (this.keywords) {
        state.query = this.keywords;
      }
      if (this.mps) {
        state.mps = this.mps;
      }
      if (this.pgs) {
        state.pgs = this.pgs;
      }

      return `${this.url}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
  },
  mounted() {
    const searchUrl = `${
      this.slugs.urls.isci
    }/search/speeches?q=${encodeURIComponent(
      this.keywords
    )}&people=${this.mps.join(',')}&parties=${this.pgs.join(',')}`;
    axios
      .get(searchUrl)
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

<style lang="scss" scoped>
.timelinechart,
.timebarchart {
  flex: 1;
  height: 100%;
  display: flex;

  ::v-deep svg {
    width: 100%;
    height: 100%;
  }
}

::v-deep .p-tabs {
  height: 100%;

  .p-tabs-content {
    display: flex;
    align-items: center;

    .tab-content {
      flex-basis: 100%;
      height: 100%;
    }
  }
}
</style>

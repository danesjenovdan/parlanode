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

    <div
      v-if="!loading && data && data.response.numFound === 0"
      v-t="'no-results'"
      class="no-results"
    />
    <div v-else id="pie-chart">
      <pie-chart :data="pieData" />
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import common from '@/_mixins/common.js';
import { search as searchContext } from '@/_mixins/contextUrls.js';
import { searchTitle } from '@/_mixins/titles.js';
import { searchHeader } from '@/_mixins/altHeaders.js';
import { searchOgImage } from '@/_mixins/ogImages.js';
// import PieChart from '@/_components/PieChart.vue';
import stateLoader from '@/_helpers/stateLoader.js';

export default {
  name: 'CardSearchUsageByGroup',
  components: {
    // PieChart,
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
    generatedCardUrl() {
      const state = { query: this.keywords };
      return `${this.url}?state=${encodeURIComponent(
        JSON.stringify(state)
      )}&altHeader=true`;
    },
    pieData() {
      return (this.data && this.data.facet_counts.facet_fields.party_id) || [];
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
@import 'parlassets/scss/breakpoints';

#pie-chart {
  height: $full-card-height;

  @include respond-to(mobile) {
    height: auto;
    max-height: $full-card-height;
  }
}
</style>

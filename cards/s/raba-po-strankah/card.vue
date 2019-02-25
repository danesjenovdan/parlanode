<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :content-class="['full', {'is-loading': loading}]"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <p v-t="'info.text'" class="info-text"></p>
    </div>

    <div
      v-t="'no-results'"
      v-if="!loading && data && data.response.numFound === 0"
      class="no-results"
    />
    <div v-else id="pie-chart">
      <pie-chart :data="pieData" />
    </div>
  </card-wrapper>
</template>

<script>
import axios from 'axios';
import common from 'mixins/common';
import { search as searchContext } from 'mixins/contextUrls';
import { searchTitle } from 'mixins/titles';
import { searchHeader } from 'mixins/altHeaders';
import { searchOgImage } from 'mixins/ogImages';
import PieChart from 'components/PieChart.vue';
import stateLoader from 'helpers/stateLoader';

export default {
  name: 'RabaPoPoslanskihSkupinah',
  components: {
    PieChart,
  },
  mixins: [
    common,
    searchTitle,
    searchHeader,
    searchOgImage,
    searchContext,
  ],
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
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true`;
    },
    pieData() {
      return (this.data && this.data.facet_counts.facet_fields.party_id) || [];
    },
  },
  mounted() {
    const searchUrl = `${this.slugs.urls.isci}/search/speeches?q=${encodeURIComponent(this.keywords)}&people=${this.mps.join(',')}&parties=${this.pgs.join(',')}`;
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

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

#pie-chart {
  height: $full-card-height;

  @include respond-to(mobile) {
    height: auto;
    max-height: $full-card-height;
  }
}
</style>

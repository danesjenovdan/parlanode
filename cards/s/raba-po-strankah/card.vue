<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead">
        Pregled pogostosti pojavljanja iskalnega niza v govorih glede na poslansko skupino.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Za vsak zadetek glede na iskalni niz preverimo, v koliko govorih poslank in poslancev poslanskih skupin se pojavi. Seštejemo jih glede na poslansko skupino in prikažemo v krožnem grafikonu.
      </p>
    </div>

    <div v-if="data.response.numFound === 0" class="no-results">Brez zadetkov.</div>
    <div v-else id="pie-chart">
      <pie-chart :data="pieData" />
    </div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import { searchTitle } from 'mixins/titles';
import PieChart from 'components/PieChart.vue';

export default {
  mixins: [
    common,
    searchTitle,
  ],
  components: {
    PieChart,
  },
  name: 'RabaPoPoslanskihSkupinah',
  data() {
    const keywords = this.$options.cardData.data.responseHeader.params.q.split('content_t:')[1].split(')')[0];
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
    generatedCardUrl() {
      const state = { text: this.keywords };
      const searchUrl = `https://isci.parlameter.si/q/${this.keywords}`;
      return `${this.url}?state=${encodeURIComponent(JSON.stringify(state))}&altHeader=true&customUrl=${encodeURIComponent(searchUrl)}`;
    },
    pieData() {
      return this.data.facet_counts.facet_fields.party_i;
    },
  },
  methods: {
  },
};
</script>

<style lang="scss" scoped>
@import '~parlassets/scss/breakpoints';

#pie-chart {
  height: 518px;

  @include respond-to(mobile) {
    height: auto;
    max-height: 518px;
  }
}
</style>

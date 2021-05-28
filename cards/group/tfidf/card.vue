<template>
  <card-wrapper
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
  >
    <bar-chart v-if="chartRows.length" :data="chartRows" />
    <!-- TODO: empty state should handle this -->
    <div v-else v-t="'no-speeches'" class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { partySpeeches } from '@/_mixins/contextUrls.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import BarChart from '@/_components/BarChart.vue';

export default {
  name: 'CardGroupTfidf',
  components: {
    BarChart,
  },
  mixins: [common, partySpeeches, partyHeader, partyOgImage, links],
  data() {
    return {
      data: this.$options.contextData.cardData,
    };
  },
  computed: {
    chartRows() {
      return this.data.results.map((item) => ({
        label: this.decodeHTML(item.term),
        value: Math.round(item.scores['tf-idf'] * 5000),
        link: this.getSearchTermLink(item.term, { pgs: [this.data.party.id] }),
      }));
    },
    generatedCardUrl() {
      return `${this.url}${this.data.party.id}?altHeader=true`;
    },
  },
  methods: {
    decodeHTML(html) {
      return html.replace('&shy;', '\u00AD');
    },
  },
};
</script>

<style lang="scss" scoped>
.empty-dataset {
  font-size: 16px;
  line-height: 20px;
  margin: 70px 0;
  text-align: center;
  font-style: italic;
}

:deep(.card-content-front) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.word-list {
  width: 100%;
}
</style>

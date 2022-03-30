<template>
  <card-wrapper :header-config="headerConfig">
    <empty-state v-if="!chartRows.length" />
    <bar-chart v-else :data="chartRows" />
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { partySpeechesContextUrl } from '@/_mixins/contextUrls.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import BarChart from '@/_components/BarChart.vue';
import EmptyState from '@/_components/EmptyState.vue';

export default {
  name: 'CardGroupTfidf',
  components: {
    BarChart,
    EmptyState,
  },
  mixins: [common, partySpeechesContextUrl, partyHeader, partyOgImage, links],
  computed: {
    topTfidf() {
      const results = this.cardData.data?.results || [];
      // api returns unsorted tfidf, sort them in descending order
      const sortedTfidf = results.slice().sort((a, b) => {
        return (b.value ?? 0) - (a.value ?? 0);
      });
      // api can return more than 10, limit them to 10 for calculations
      return sortedTfidf.slice(0, 10);
    },
    chartRows() {
      return this.topTfidf.map((item) => ({
        label: item.token,
        value: Math.round(item.value * 5000),
        // TODO we used to pass pgs in here to get the link
        // to filter only speeches that belong to this pg.
        // this feature isn't implemented on the new parladata
        // yet, so it's excluded. it should be reimplemented.
        link: this.getSearchTermLink(item.token),
      }));
    },
  },
};
</script>

<style lang="scss" scoped>
:deep(.card-content-front) {
  display: flex;
  align-items: center;
  justify-content: center;
}

.word-list {
  width: 100%;
}
</style>

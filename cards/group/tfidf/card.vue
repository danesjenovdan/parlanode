<template>
  <card-wrapper :header-config="headerConfig">
    <bar-chart v-if="chartRows.length" :data="chartRows" />
    <!-- TODO: empty state should handle this -->
    <div v-else v-t="'no-speeches'" class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { partySpeechesContextUrl } from '@/_mixins/contextUrls.js';
import { partyHeader } from '@/_mixins/altHeaders.js';
import { partyOgImage } from '@/_mixins/ogImages.js';
import BarChart from '@/_components/BarChart.vue';

export default {
  name: 'CardGroupTfidf',
  components: {
    BarChart,
  },
  mixins: [common, partySpeechesContextUrl, partyHeader, partyOgImage, links],
  computed: {
    chartRows() {
      const results = this.cardData.data?.results || [];
      const group = this.cardData.data?.group || {};
      return results.map((item) => ({
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

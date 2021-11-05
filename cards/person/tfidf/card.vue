<template>
  <card-wrapper :header-config="headerConfig">
    <bar-chart v-if="chartRows.length" :data="chartRows" />
    <!-- TODO: let empty state take care of this -->
    <div v-else v-t="'no-speeches'" class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links.js';
import common from '@/_mixins/common.js';
import { personHeader } from '@/_mixins/altHeaders.js';
import { personOgImage } from '@/_mixins/ogImages.js';
import { personSpeeches } from '@/_mixins/contextUrls.js';
import BarChart from '@/_components/BarChart.vue';

export default {
  name: 'CardPersonTfidf',
  components: {
    BarChart,
  },
  mixins: [common, personSpeeches, personHeader, personOgImage, links],
  computed: {
    chartRows() {
      const results = this.cardData.data?.results || [];
      const person = this.cardData.data?.person || {};
      return results.map((item) => ({
        label: item.token,
        value: Math.round(item.value * 5000),
        link: this.getSearchTermLink(item.term, { mps: [person.slug] }),
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

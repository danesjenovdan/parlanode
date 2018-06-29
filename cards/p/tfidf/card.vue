<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    content-height="518px"
  >
    <div slot="info">
      <p v-t="'info.lead'" class="info-text lead"></p>
      <p v-t="'info.methodology'" class="info-text heading"></p>
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          v-t="'info.link.text'"
          :href="$t('info.link.link')"
          place="link"
          class="funblue-light-hover"
          target="_blank"
        />
      </i18n>
      <p v-t="'info.text[1]'" class="info-text"></p>
    </div>

    <bar-chart v-if="chartRows.length" :data="chartRows" />
    <div v-t="'no-speeches'" v-else class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import { getSearchTermLink } from 'components/links';
import common from 'mixins/common';
import { memberHeader } from 'mixins/altHeaders';
import { memberSpeeches } from 'mixins/contextUrls';
import BarChart from 'components/BarChart.vue';

export default {
  name: 'PoslanecTFIDF',
  components: {
    BarChart,
  },
  mixins: [
    common,
    memberSpeeches,
    memberHeader,
  ],
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    chartRows() {
      return this.data.results.map(item => ({
        label: item.term,
        value: Math.round(item.scores['tf-idf'] * 5000),
        link: getSearchTermLink(item.term),
      }));
    },
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.person.id}?altHeader=true`;
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
</style>

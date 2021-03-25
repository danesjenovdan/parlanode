<template>
  <card-wrapper
    :id="$options.cardData.mountId"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
    :og-config="ogConfig"
    content-class="full"
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
    <div v-else v-t="'no-speeches'" class="empty-dataset"></div>
  </card-wrapper>
</template>

<script>
import links from '@/_mixins/links';
import common from '@/_mixins/common';
import { partySpeeches } from '@/_mixins/contextUrls';
import { partyHeader } from '@/_mixins/altHeaders';
import { partyOgImage } from '@/_mixins/ogImages';
import BarChart from '@/_components/BarChart.vue';

export default {
  name: 'PSTFIDF',
  components: { BarChart },
  mixins: [common, partySpeeches, partyHeader, partyOgImage, links],
  data() {
    return {
      data: this.$options.cardData.data,
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

::v-deep .card-content-front {
  display: flex;
  align-items: center;
  justify-content: center;
}

.word-list {
  width: 100%;
}
</style>

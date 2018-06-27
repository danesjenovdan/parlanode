<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig"
  >
    <div slot="info">
      <p class="info-text lead" v-t="'info.lead'"></p>
      <p class="info-text heading" v-t="'info.methodology'"></p>
      <i18n path="info.text[0]" tag="p" class="info-text">
        <a
          place="link"
          class="funblue-light-hover"
          target="_blank"
          :href="$t('info.link.link')"
          v-t="'info.link.text'"
        />
      </i18n>
      <p class="info-text" v-t="'info.text[1]'"></p>
    </div>

    <bar-chart v-if="chartRows.length" :data="chartRows" />
    <div v-else class="empty-dataset" v-t="'no-speeches'"></div>
  </card-wrapper>
</template>

<script>
import { getSearchTermLink } from 'components/links';
import common from 'mixins/common';
import { partySpeeches } from 'mixins/contextUrls';
import { partyHeader } from 'mixins/altHeaders';
import BarChart from 'components/BarChart.vue';

export default {
  components: { BarChart },
  mixins: [
    common,
    partySpeeches,
    partyHeader,
  ],
  name: 'PSTFIDF',
  data() {
    return {
      data: this.$options.cardData.data,
    };
  },
  computed: {
    chartRows() {
      return this.data.results.map(item => ({
        label: this.decodeHTML(item.term),
        value: Math.round(item.scores['tf-idf'] * 5000),
        link: getSearchTermLink(item.term),
      }));
    },
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.party.id}?altHeader=true`;
    },
  },
  methods: {
    decodeHTML(html) {
      return html.replace('&shy;', '\u00AD');
    },
  },
  created() {
    const context = this.$root.$options.cardData;
    context.template.pageTitle = `Besede, ki jih zaznamujejo - ${context.data.party.name}`;
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

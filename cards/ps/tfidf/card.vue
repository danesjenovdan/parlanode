<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Izpis 10 besed in besednih zvez, ki jih poslanska skupina uporablja pogosteje kot ostale poslanske skupine v DZ.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Analizo izvajamo po statistiki <a href="https://en.wikipedia.org/wiki/Tf-idf">tf-idf</a>.</p>
      <p class="info-text">Korpus predstavljajo vsi govori, dokument pa vsi govori poslank in poslancev v poslanski skupini.</p>
    </div>

    <bar-chart :data="chartRows" />
  </card-wrapper>
</template>

<script>
import { getSearchTermLink } from 'components/links';
import common from 'mixins/common';
import { partySpeeches } from 'mixins/contextUrls';
import BarChart from 'components/BarChart.vue';

export default {
  components: { BarChart },
  mixins: [common, partySpeeches],
  name: 'PSTFIDF',
  data() {
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: 'Besede, ki jih zaznamujejo',
      },
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
    measurePiwik(filter, sort, order) {
      if (typeof measure === 'function') {
        if (sort !== '') {
          measure('s', 'session-sort', `${sort} ${order}`, '');
        } else if (filter !== '') {
          measure('s', 'session-filter', filter, '');
        }
      }
    },
  },
  created() {
    const context = this.$root.$options.cardData;
    context.template.pageTitle =
      `Besede, ki jih zaznamujejo - ${context.data.party.name}`;
  },
};
</script>

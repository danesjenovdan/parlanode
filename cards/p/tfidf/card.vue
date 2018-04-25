<template>
  <card-wrapper
    contentHeight="518px"
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">Izpis 10 besed in besednih zvez, ki jih {{ vocabulary.poslanec[gender] }} uporablja pogosteje kot ostali poslanci v DZ.</p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">Analizo izvajamo po statistiki <a href="https://en.wikipedia.org/wiki/Tf-idf">tf-idf</a>.</p>
      <p class="info-text">Korpus predstavljajo vsi govori, dokument pa vsi {{ vocabulary.poslanca3[gender] }} govori.</p>
    </div>

    <bar-chart :data="chartRows" />
  </card-wrapper>
</template>

<script>
import { getSearchTermLink } from 'components/links';
import common from 'mixins/common';
import { memberSpeeches } from 'mixins/contextUrls';
import BarChart from 'components/BarChart.vue';

export default {
  components: { BarChart },
  mixins: [common, memberSpeeches],
  name: 'PoslanecTFIDF',
  data() {
    const { gender } = this.$options.cardData.data.person;

    return {
      data: this.$options.cardData.data,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: `Besede, ki ${gender === 'm' ? 'ga' : 'jo'} zaznamujejo`,
      },
      gender,
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
  methods: {
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
    const pronoun = context.data.person.gender === 'f' ? 'jo' : 'ga';
    context.template.pageTitle =
      `Besede, ki ${pronoun} zaznamujejo - ${context.data.person.name}`;
  }
};
</script>

<template>
  <card-wrapper
    :id="$options.cardData.cardData._id"
    :card-url="generatedCardUrl"
    :header-config="headerConfig">

    <div slot="info">
      <p class="info-text lead">
        Izpis 10 besed in besednih zvez, ki so bile na seji uporabljene pogosteje kot na vseh drugih sejah.
      </p>
      <p class="info-text heading">METODOLOGIJA</p>
      <p class="info-text">
        Analizo izvajamo po statistiki <a target="_blank" class="funblue-light-hover" href="https://en.wikipedia.org/wiki/Tf%E2%80%93idf">tf-idf</a>.
      </p>
      <p class="info-text">
        Korpus predstavljajo vsi govori, dokument pa vsi govori na seji.
      </p>
    </div>

    <div v-if="chartRows.length" class="columns">
      <bar-chart :data="chartRows1" :alreadyCalculated="true" />
      <bar-chart :data="chartRows2" :alreadyCalculated="true" />
    </div>
    <div v-else class="empty-dataset">Seja v obdelavi.</div>
  </card-wrapper>
</template>

<script>
import common from 'mixins/common';
import BarChart from 'components/BarChart.vue';
import { getSearchTermLink } from 'components/links';

export default {
  components: {
    BarChart,
  },
  mixins: [common],
  name: 'BesedeKiSoZaznamovaleSejo',
  data() {
    const sessionName = this.$options.cardData.data.session.name;
    let imageName = 'seja-redna';
    if (sessionName.indexOf('izredna') !== -1) {
      imageName = 'seja-izredna';
    } else if (sessionName.indexOf('nujna') !== -1) {
      imageName = 'seja-nujna';
    }
    return {
      data: this.$options.cardData.data,
      headerConfig: {
        mediaImage: imageName,
        heading: this.$options.cardData.data.session.name,
        subheading: this.$options.cardData.data.session.date,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    chartRows() {
      // JSON.parse(JSON.stringify(this.data.results));
      const rows = this.data.results
        .map((row) => {
          row.value = Math.round(row.scores['tf-idf'] * 5000);
          return row;
        });

      const mymax = this.data.results.reduce((acc, row) => Math.max(acc, row.value), 0);
      const mytotal = this.data.results.reduce((acc, row) => acc + row.value, 0);

      return rows
        .map(row => ({
          name: this.decodeHTML(row.term),
          value: row.value,
          link: getSearchTermLink(row.term),
          widthPercentage: (row.value / mymax) * (this.showNumbers ? 80 : 100),
          percentage: ((row.value / mytotal) * 100).toFixed(2),
        }))
        .sort((a, b) => b.value - a.value);
    },
    chartRows1() {
      return this.chartRows.slice(0, 5);
    },
    chartRows2() {
      return this.chartRows.slice(5, 10);
    },
    generatedCardUrl() {
      return `${this.url}${this.$options.cardData.data.session.id}?altHeader=true`;
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
.columns {
  display: flex;

  .word-list {
    flex: 1;

    &:first-child {
      margin-right: 20px;
    }
  }
}
</style>

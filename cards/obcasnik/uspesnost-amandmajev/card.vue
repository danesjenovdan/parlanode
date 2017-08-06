<template>
  <div class="card-container card-halfling card-IME_KARTICE" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <stacked-bar-chart :data="rows"></stacked-bar-chart>
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="generatedCardUrl" />
    </div>
    <card-footer :link="slugs.base" />
  </div>
</template>

<script>
/* globals window $ measure */
import common from 'mixins/common';
import StackedBarChart from 'components/StackedBarChart.vue';

export default {
  components: {
    StackedBarChart
  },
  mixins: [common],
  name: 'ImeKartice',
  data() {
    const data = this.$options.cardData.data
    const parties =  ['SDS', 'SMC', 'Levica', 'DeSUS', 'NP', 'SD', 'NSi', 'IMNS']; // PAZI NA PS NP vs. NP

    const rows = parties.map((acronym) => {
      const successful = data
        .filter(e => e.acronym === acronym)
        .filter(e => e.result)
        .length;

      const unsuccessful = data
        .filter(e => e.acronym === acronym)
        .filter(e => !e.result)
        .length;

      return {
        name: data.filter(e => e.acronym === acronym)[0].orgData.acronym,
        acronym: data.filter(e => e.acronym === acronym)[0].orgData.acronym,
        stack: [
          {
            label: 'uspešnih',
            value: successful
          },
          {
            label: 'neuspešnih',
            value: unsuccessful
          }
        ],
      }
    });

    return {
      data,
      slugs: this.$options.cardData.urlsData,
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      rows,
      generatedCardUrl: 'https://glej.parlameter.si/obcasnik/uspesnost-amandmajev/?state={}',
    };
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
    focusTab() {
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
</style>

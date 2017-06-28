<template>
  <div class="card-container card-halfling card-IME_KARTICE" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <stacked-bar-chart :data="data" :properties="['seat_count']"></stacked-bar-chart>
      </div>

      <card-info>
        <p class="info-text lead"></p>
        <p class="info-text heading">METODOLOGIJA</p>
        <p class="info-text"></p>
      </card-info>

      <card-embed :url="generatedCardUrl" />

      <card-share :url="shortenedCardUrl" />
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
    return {
      data: this.$options.cardData.data.data,
      slugs: this.$options.cardData.urlsData,
      shortenedCardUrl: '',
      url: 'https://glej.parlameter.si/group/method/',
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
      generatedCardUrl: 'https://glej.parlameter.si/group/method/',
    };
  },
  methods: {
    shortenUrl() {
      return new Promise((resolve) => {
        $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${this.url}&frame=true`)}`, (response) => {
          this.$el.querySelector('.card-content-share button').textContent = 'KOPIRAJ';
          resolve(response);
        });
      });
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
    focusTab() {
      return true;
    },
  },
  mounted() {
    this.shortenUrl();
  },
};
</script>

<style lang="scss" scoped>
</style>

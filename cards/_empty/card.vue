<template>
  <div class="card-container card-halfling card-IME_KARTICE" :id="$options.cardData.cardData._id">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">

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

export default {
  components: { },
  mixins: [common],
  name: 'ImeKartice',
  data() {
    return {
      data: this.$options.cardData.data,
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
    };
  },
  methods: {
    shortenUrl(url) {
      return new Promise((resolve) => {
        $.get(`https://parla.me/shortner/generate?url=${window.encodeURIComponent(`${url}&frame=true`)}`, (response) => {
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
  },
  mounted() {
    this.shortenUrl(this.generatedCardUrl).then((newShortenedUrl) => {
      this.shortenedCardUrl = newShortenedUrl;
    });
  },
  watch: {
    generatedCardUrl: function(url) {
      this.shortenUrl(url).then((newShortenedUrl) => {
        this.shortenedCardUrl = newShortenedUrl;
      });
    }
  }
};
</script>

<style lang="scss" scoped>
</style>

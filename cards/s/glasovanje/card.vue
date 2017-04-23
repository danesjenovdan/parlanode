<template>
  <div class="card-container card-halfling card-glasovanje">
    <card-header :config="headerConfig" />

    <div class="card-content">
      <div class="card-content-front">
        <tabs style="margin-top: 50px;" v-cloak>
          <tab header="Poslanci">Poslanci</tab>
          <tab header="Poslanske skupine">Poslanske skupine</tab>
          <tab header="Stran vlade">
            <h1>Tab three content</h1>
          </tab>
        </tabs>
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
import CardInfo from 'components/Card/Info.vue';
import CardEmbed from 'components/Card/Embed.vue';
import CardShare from 'components/Card/Share.vue';
import CardHeader from 'components/Card/Header.vue';
import CardFooter from 'components/Card/Footer.vue';
import initializeBack from 'mixins/initializeBack';

export default {
  components: { CardInfo, CardEmbed, CardShare, CardHeader, CardFooter },
  mixins: [initializeBack],
  name: 'GlasovanjeSeje',
  data() {
    return {
      data: this.$options.cardData.data,
      slugs: this.$options.cardData.urlsData,
      shortenedCardUrl: '',
      headerConfig: {
        circleIcon: 'og-list',
        heading: '&nbsp;',
        subheading: '7. sklic parlamenta',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      },
    };
  },
  computed: {
    generatedCardUrl() {
      return 'https://glej.parlameter.si/group/method/';
    },
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
  watch: {
    generatedCardUrl(newUrl) {
      this.shortenUrl(newUrl).then(newShortenedUrl => (this.shortenedCardUrl = newShortenedUrl));
    },
  },
  beforeMount() {
    this.shortenUrl(this.generatedCardUrl);
  },
};
</script>

<style lang="sass" scoped>
</style>

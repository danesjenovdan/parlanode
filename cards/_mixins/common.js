import CardWrapper from '@/_components/Card/Wrapper.vue';

export default {
  components: {
    CardWrapper,
  },
  data() {
    return {
      cardName: this.$root.$options.contextData.cardName,
      cardData: this.$root.$options.contextData.cardData,
      slugs: this.$root.$options.contextData.slugs,
    };
  },
  created() {
    // only create template object if it does not already exist to prevent
    // nested components overwriting custom data
    if (this.$root.$options.contextData.template == null) {
      this.$root.$options.contextData.template = {
        pageTitle: this.$te('card.title') ? this.$t('card.title') : '',
        // TODO: change how big/high are set
        frameContainerClass: this.$root.$options.contextData.cardData.big
          ? 'col-md-12'
          : 'col-md-6 col-md-offset-3',
        embedContainerClass:
          (this.$root.$options.contextData.cardData.big ? ' big-card' : '') +
          (this.$root.$options.contextData.cardData.high ? ' high-card' : ''),
        contextUrl: this.slugs.urls.base,
        ogText: this.$t('ogText'),
      };

      // TODO: og config data
      // const { ogConfig } = this;
      // if (ogConfig) {
      //   const { name, ...params } = ogConfig;
      //   const ogImagePath = `${this.slugs.urls.glej}/og-image/${name}/`;
      //   const ogImageParams = `?${Object.keys(params)
      //     .map((k) => `${k}=${encodeURIComponent(params[k])}`)
      //     .join('&')}`;
      //   this.$root.$options.contextData.template.ogImageUrl = `${ogImagePath}${ogImageParams}`;
      // } else {
      //   // eslint-disable-next-line no-console
      //   console.warn('Missing ogConfig!');
      // }
    }
  },
  computed: {
    url() {
      return `${this.slugs.urls.glej}/${this.cardName}/`;
    },
  },
  methods: {
    encodeQueryData(data) {
      return `?${Object.keys(data)
        .reduce((a, k) => {
          a.push(`${k}=${encodeURIComponent(data[k])}`);
          return a;
        }, [])
        .join('&')}`;
    },
  },
};

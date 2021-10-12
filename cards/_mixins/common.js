import CardWrapper from '@/_components/Card/Wrapper.vue';

export default {
  components: {
    CardWrapper,
  },
  data() {
    // eslint-disable-next-line no-restricted-properties
    const { contextData } = this.$root.$options;
    return {
      cardName: contextData.cardName,
      cardData: contextData.cardData ?? {},
      cardState: contextData.cardState ?? {},
      urls: contextData.urls,
    };
  },
  created() {
    // eslint-disable-next-line no-restricted-properties
    const rootOptions = this.$root.$options;

    // only create template object if it does not already exist to prevent
    // nested components overwriting custom data
    if (rootOptions.contextData.template == null) {
      // eslint-disable-next-line no-restricted-properties
      rootOptions.contextData.template = {
        pageTitle: this.$te('card.title') ? this.$t('card.title') : '',
        frameContainerClass: rootOptions.cardInfo?.doubleWidth
          ? 'col-md-12'
          : 'col-md-6 col-md-offset-3',
        embedContainerClass: '',
        //   (rootOptions.cardInfo?.doubleWidth ? ' big-card' : '') +
        //   (rootOptions.cardInfo?.fullHeight ? ' high-card' : ''),
        contextUrl: this.urls.site,
      };

      // TODO: og config data
      // ogText: this.$t('ogText'),
      // const { ogConfig } = this;
      // if (ogConfig) {
      //   const { name, ...params } = ogConfig;
      //   const ogImagePath = `${this.slugs.urls.glej}/og-image/${name}/`;
      //   const ogImageParams = `?${Object.keys(params)
      //     .map((k) => `${k}=${encodeURIComponent(params[k])}`)
      //     .join('&')}`;
      //   rootOptions.contextData.template.ogImageUrl = `${ogImagePath}${ogImageParams}`;
      // } else {
      //   // eslint-disable-next-line no-console
      //   console.warn('Missing ogConfig!');
      // }
    }
  },
  computed: {
    url() {
      return `${this.urls.cards}/${this.cardName}/?id=${this.cardData.id}`;
    },
  },
};

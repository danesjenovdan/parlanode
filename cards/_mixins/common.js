import CardWrapper from 'components/Card/Wrapper.vue';
import url from 'mixins/url';

export default {
  data() {
    return {
      slugs: this.$root.$options.cardData.urls,
    };
  },
  components: {
    CardWrapper,
  },
  mixins: [
    url,
  ],
  created() {
    // only create template object if it does not already exist to prevent
    // nested components overwriting custom data
    if (this.$root.$options.cardData.template == null) {
      this.$root.$options.cardData.template = {
        pageTitle: this.$te('card.title') ? this.$t('card.title') : '',
        frameContainerClass: this.$root.$options.cardData.cardData.big
          ? 'col-md-12'
          : 'col-md-6 col-md-offset-3',
        embedContainerClass:
          (this.$root.$options.cardData.cardData.big ? ' big-card' : '')
          + (this.$root.$options.cardData.cardData.high ? ' high-card' : ''),
        contextUrl: this.slugs.urls.base,
        ogText: this.$t('ogText'),
      };
    }
  },
};

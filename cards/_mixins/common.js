import { computed } from 'vue';
import CardWrapper from '@/_components/Card/Wrapper.vue';

export default {
  components: {
    CardWrapper,
  },
  data() {
    const { contextData } = this.$root.$options;
    return {
      cardName: contextData.cardName,
      cardData: contextData.cardData ?? {},
    };
  },
  provide() {
    return {
      cardUrl: computed(() => this.cardUrl),
    };
  },
  created() {
    const rootOptions = this.$root.$options;

    // only create template object if it does not already exist to prevent
    // nested components overwriting custom data
    if (rootOptions.contextData.template == null) {
      rootOptions.contextData.template = {
        pageTitle: this.$te('card.title') ? this.$t('card.title') : '',

        frameContainerClass: rootOptions.cardInfo?.doubleWidth
          ? 'col-md-12'
          : 'col-md-6 col-md-offset-3',

        embedContainerClass: '',
        //   (rootOptions.cardInfo?.doubleWidth ? ' big-card' : '') +
        //   (rootOptions.cardInfo?.fullHeight ? ' high-card' : ''),

        // This is the default value. If you want to override, add a mixin from
        // contextUrls.js in the specific card.
        contextUrl: rootOptions.contextData.urls.site,
      };
    } else {
      // eslint-disable-next-line no-console
      console.error(
        'Common mixin included more than once!',
        'Make sure only the top level component includes it!'
      );
    }
  },
  computed: {
    cardUrl() {
      const { urls } = this.$root.$options.contextData;
      const beforeStateUrl = `${urls.cards}/${this.cardName}/?id=${this.cardData.id}`;
      const cardState = this.$root.$options.contextData.cardState;
      const stateParams = Object.keys(cardState).reduce((prev, curr) => {
        return `${prev}&${encodeURIComponent(curr)}=${encodeURIComponent(cardState[curr])}`
      }, '');
      return `${beforeStateUrl}${stateParams}`
    },
  },
};

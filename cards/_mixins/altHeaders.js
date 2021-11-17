import { assign } from 'lodash-es';
import sessionClassification from '@/_helpers/sessionClassification.js';

export const personHeader = {
  computed: {
    headerConfig() {
      const { cardState } = this.$root.$options.contextData;
      let coalitionText;
      if (this.cardData.organization) {
        coalitionText = this.cardData.organization.is_coalition
          ? this.$t('coalition')
          : this.$t('opposition');
      }
      return {
        circleImage: this.cardData.image,
        heading: this.cardData.name,
        subheading: `${this.cardData.organization?.acronym} | ${coalitionText}`,
        alternative: cardState?.altHeader,
        title: this.$t('card.title'),
      };
    },
  },
};

export const partyHeader = {
  computed: {
    headerConfig() {
      const { cardState } = this.$root.$options.contextData;
      const coalitionText = this.cardData.is_coalition
        ? this.$t('coalition')
        : this.$t('opposition');
      return {
        mediaImage: 'party',
        circleClass: `${(this.cardData.acronym || '')
          .replace(/[ +,]/g, '_')
          .toLowerCase()}-background`,
        heading: this.cardData.name,
        subheading: `${this.cardData.acronym} | ${coalitionText}`,
        alternative: cardState?.altHeader,
        title: this.$t('card.title'),
      };
    },
  },
};

export const searchHeader = {
  computed: {
    headerConfig() {
      const { cardState } = this.$root.$options.contextData;
      return {
        circleIcon: 'og-search',
        // heading: this.keywords, // TODO: get this from contextData not from card
        subheading: 'iskalni niz', // TODO: translate this
        alternative: cardState?.altHeader,
        title: this.$t('card.title'),
      };
    },
  },
};

export const sessionHeader = {
  computed: {
    headerConfig() {
      const { cardState } = this.$root.$options.contextData;
      const session = this.cardData.data?.results?.session;
      const sessionName = session?.name || '';
      const imageName = sessionClassification(session?.classification).icon;

      return {
        mediaImage: imageName,
        heading: sessionName,
        subheading: session?.date,
        alternative: cardState?.altHeader,
        title: this.$t('card.title'),
      };
    },
  },
};

export const defaultHeaderConfig = (comp, overrides = {}) => {
  const headerConfig = {
    circleIcon: 'og-list',
    heading: '&nbsp;',
    subheading: '',
    alternative: comp.$options.contextData.cardState?.altHeader,
    title: comp.$t('card.title'),
  };
  return assign({}, headerConfig, overrides);
};

export const defaultDynamicHeaderConfig = (comp, overrides = {}) => {
  const headerConfig = {
    circleIcon: 'og-list',
    heading: '&nbsp;',
    subheading: '',
    alternative: comp.$options.contextData.cardState?.altHeader,
    title: comp.$options.contextData.cardState?.cardTitle
      ? comp.$options.contextData.cardState?.cardTitle
      : comp.$t('card.title'),
  };
  return assign({}, headerConfig, overrides);
};

import { assign } from 'lodash-es';
import sessionClassification from '@/_helpers/sessionClassification.js';

export const personOgImage = {
  computed: {
    ogConfig() {
      const { cardData } = this.$root.$options.contextData;
      let coalitionText;
      if (cardData?.organization) {
        coalitionText = cardData?.organization?.is_coalition
          ? this.$t('coalition')
          : this.$t('opposition');
      }
      return {
        name: 'circle',
        image: cardData?.image,
        h1: cardData?.name,
        h2: `${cardData?.organization?.acronym} | ${coalitionText}`,
        title: this.$t('card.title'),
      };
    },
  },
};

export const partyOgImage = {
  computed: {
    ogConfig() {
      const { cardData } = this.$root.$options.contextData;
      const coalitionText = cardData?.is_coalition
        ? this.$t('coalition')
        : this.$t('opposition');
      return {
        name: 'circle',
        acronym: cardData?.acronym,
        h1: cardData?.name,
        h2: `${cardData?.acronym} | ${coalitionText}`,
        title: this.$t('card.title'),
      };
    },
  },
};

export const searchOgImage = {
  computed: {
    ogConfig() {
      return {
        name: 'circle',
        icon: 'og-search',
        // h1: this.keywords, // TODO: get from contextData not from this
        h2: 'iskalni niz', // TODO: translate
        title: this.$t('card.title'),
      };
    },
  },
};

// TODO: get from contextData not from this
export const sessionOgImage = {
  computed: {
    ogConfig() {
      const { cardData } = this.$root.$options.contextData;
      const session = cardData?.data?.results?.session;
      const sessionName = session?.name || '';
      const iconName = sessionClassification(session?.classification).icon;

      return {
        name: 'circle',
        icon: iconName,
        h1: sessionName,
        h2: session?.date,
        title: this.$t('card.title'),
      };
    },
  },
};

export const defaultOgImage = (comp, overrides = {}) => {
  const ogConfig = {
    name: 'circle',
    icon: 'og-list',
    h2: '',
    title: comp.$t('card.title'),
  };
  return assign({}, ogConfig, overrides);
};

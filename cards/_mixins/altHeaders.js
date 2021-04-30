import { assign } from 'lodash-es';

export const memberHeader = {
  computed: {
    headerConfig() {
      const { cardData, cardState } = this.$root.$options.contextData;
      let coalitionText;
      if (cardData?.organization) {
        coalitionText = cardData.organization.is_coalition
          ? this.$t('coalition')
          : this.$t('opposition');
      }
      return {
        circleImage: cardData?.image,
        heading: cardData?.name,
        subheading: `${cardData?.organization?.acronym} | ${coalitionText}`,
        alternative: cardState?.altHeader,
        title: this.$t('card.title'),
      };
    },
  },
};

export const partyHeader = {
  computed: {
    headerConfig() {
      const { cardData, cardState } = this.$root.$options.contextData;
      const coalitionText = cardData?.is_coalition
        ? this.$t('coalition')
        : this.$t('opposition');
      return {
        mediaImage: 'party',
        circleClass: `${cardData?.acronym
          .replace(/[ +,]/g, '_')
          .toLowerCase()}-background`,
        heading: cardData?.name,
        subheading: `${cardData?.acronym} | ${coalitionText}`,
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
        heading: this.keywords, // TODO: get this from contextData not from card
        subheading: 'iskalni niz', // TODO: translate this
        alternative: cardState.altHeader,
        title: this.$t('card.title'),
      };
    },
  },
};

export const sessionHeader = {
  computed: {
    headerConfig() {
      const { cardData, cardState } = this.$root.$options.contextData;
      const session = cardData.session || cardData.results.session;
      const sessionName = session.name;

      // TODO: this needs to be generic and not sl
      let imageName = 'seja-redna';
      if (sessionName.indexOf('izredna') !== -1) {
        imageName = 'seja-izredna';
      } else if (sessionName.indexOf('nujna') !== -1) {
        imageName = 'seja-nujna';
      }

      return {
        mediaImage: imageName,
        heading: sessionName,
        subheading: session.date,
        alternative: cardState.altHeader,
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
    alternative: comp.$options.contextData.cardState.altHeader,
    title: comp.$t('card.title'),
  };
  return assign({}, headerConfig, overrides);
};

export const defaultDynamicHeaderConfig = (comp, overrides = {}) => {
  const headerConfig = {
    circleIcon: 'og-list',
    heading: '&nbsp;',
    subheading: '',
    alternative: comp.$options.contextData.cardState.altHeader,
    title: comp.$options.contextData.cardState.cardTitle
      ? comp.$options.contextData.cardState.cardTitle
      : comp.$t('card.title'),
  };
  return assign({}, headerConfig, overrides);
};

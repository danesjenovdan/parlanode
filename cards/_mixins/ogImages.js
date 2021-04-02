import { assign } from 'lodash-es';

export const memberOgImage = {
  computed: {
    ogConfig() {
      const { cardData } = this.$root.$options.contextData;
      const coalitionText = cardData.person.party.is_coalition
        ? this.$t('coalition')
        : this.$t('opposition');
      return {
        name: 'circle',
        image: cardData.person.gov_id,
        h1: cardData.person.name,
        h2: `${cardData.person.party.acronym} | ${coalitionText}`,
        title: this.$t('card.title'),
      };
    },
  },
};

export const partyOgImage = {
  computed: {
    ogConfig() {
      const { cardData } = this.$root.$options.contextData;
      const party = cardData.party ?? cardData.organization;
      const coalitionText = party.is_coalition
        ? this.$t('coalition')
        : this.$t('opposition');
      return {
        name: 'circle',
        acronym: party.acronym,
        h1: party.name,
        h2: `${party.acronym} | ${coalitionText}`,
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
        h1: this.keywords, // TODO: get from contextData not from this
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
      const cardData = this.cardData || this.$options.cardData;
      const session = cardData.data.session || cardData.data.results.session;
      const sessionName = session.name;

      // TODO: this needs to be generic and not sl
      let imageName = 'seja-redna';
      if (sessionName.indexOf('izredna') !== -1) {
        imageName = 'seja-izredna';
      } else if (sessionName.indexOf('nujna') !== -1) {
        imageName = 'seja-nujna';
      }

      return {
        name: 'circle',
        icon: imageName,
        h1: sessionName,
        h2: session.date,
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

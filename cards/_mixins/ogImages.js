import { assign } from 'lodash';

export const memberOgImage = {
  computed: {
    ogConfig() {
      const person = this.person || this.data.person;
      const coalitionText = person.party.is_coalition ? this.$t('coalition') : this.$t('opposition');

      return {
        name: 'circle',
        image: person.gov_id,
        h1: person.name,
        h2: `${person.party.acronym} | ${coalitionText}`,
        title: this.$t('card.title'),
      };
    },
  },
};

export const partyOgImage = {
  computed: {
    ogConfig() {
      const party = this.party || this.data.party;
      const coalitionText = party.is_coalition ? this.$t('coalition') : this.$t('opposition');

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
        h1: this.keywords,
        h2: 'iskalni niz',
        title: this.$t('card.title'),
      };
    },
  },
};

export const sessionOgImage = {
  computed: {
    ogConfig() {
      const cardData = this.cardData || this.$options.cardData;
      const session = cardData.data.session || cardData.data.results.session;
      const sessionName = session.name;

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

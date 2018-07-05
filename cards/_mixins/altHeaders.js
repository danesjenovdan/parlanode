import { assign } from 'lodash';

export const memberHeader = {
  computed: {
    headerConfig() {
      const cardData = this.cardData || this.$options.cardData;
      const person = this.person || this.data.person;
      const coalitionText = person.party.is_coalition ? this.$t('coalition') : this.$t('opposition');

      return {
        circleImage: person.gov_id,
        heading: person.name,
        subheading: `${person.party.acronym} | ${coalitionText}`,
        alternative: cardData.cardData.altHeader === 'true',
        title: cardData.cardData.name,
      };
    },
  },
};

export const partyHeader = {
  computed: {
    headerConfig() {
      const cardData = this.cardData || this.$options.cardData;
      const party = this.party || this.data.party;
      const coalitionText = party.is_coalition ? this.$t('coalition') : this.$t('opposition');

      return {
        circleText: party.acronym,
        circleClass: `${party.acronym.replace(/ /g, '_').toLowerCase()}-background`,
        heading: party.name,
        subheading: `${party.acronym} | ${coalitionText}`,
        alternative: cardData.cardData.altHeader === 'true',
        title: cardData.cardData.name,
      };
    },
  },
};

export const searchHeader = {
  computed: {
    headerConfig() {
      return {
        circleIcon: 'og-search',
        heading: this.keywords,
        subheading: 'iskalni niz',
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      };
    },
  },
};

export const sessionHeader = {
  computed: {
    headerConfig() {
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
        mediaImage: imageName,
        heading: sessionName,
        subheading: session.date,
        alternative: cardData.cardData.altHeader === 'true',
        title: cardData.cardData.name,
      };
    },
  },
};

export const defaultHeaderConfig = (comp, overrides = {}) => {
  const headerConfig = {
    circleIcon: 'og-list',
    heading: '&nbsp;',
    subheading: '7. sklic parlamenta',
    alternative: comp.$options.cardData.cardData.altHeader === 'true',
    title: comp.$options.cardData.cardData.name,
  };

  return assign({}, headerConfig, overrides);
};

import { assign } from 'lodash-es';
import sessionClassification from '@/_helpers/sessionClassification.js';

export const personHeader = {
  computed: {
    headerConfig() {
      const { cardData, cardState } = this.$root.$options.contextData;
      const person = cardData?.data?.person || {};
      return {
        circlePerson: person,
        heading: person.name,
        subheading: person.group?.is_in_coalition
          ? `${person.group?.acronym} | ${this.$t('coalition')}`
          : person.group?.acronym,
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
      const group = cardData?.data?.group || {};
      return {
        mediaImage: 'party',
        circleColor: group.color,
        heading: group.name,
        subheading: group.is_in_coalition
          ? `${group.acronym} | ${this.$t('coalition')}`
          : group.acronym,
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
        heading: `"${cardState.text}"`,
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
      const session = this.cardData.data?.session;
      const sessionName = session?.name || '';
      const imageName = sessionClassification(session?.classification).icon;

      return {
        mediaImage: imageName,
        circleColor: '#ffffff',
        heading: sessionName,
        subheading: session?.date,
        alternative: cardState?.altHeader,
        title: this.$t('card.title'),
      };
    },
  },
};

export const defaultHeaderConfig = (comp, overrides = {}) => {
  const { cardState } = comp.$root.$options.contextData;
  const headerConfig = {
    circleIcon: 'og-list',
    heading: '&nbsp;',
    subheading: '',
    alternative: cardState?.altHeader,
    title: comp.$t('card.title'),
  };
  return assign({}, headerConfig, overrides);
};

export const defaultDynamicHeaderConfig = (comp, overrides = {}) => {
  const { cardState } = comp.$root.$options.contextData;
  const headerConfig = {
    circleIcon: 'og-list',
    heading: '&nbsp;',
    subheading: '',
    alternative: cardState?.altHeader,
    title: cardState?.cardTitle ? cardState?.cardTitle : comp.$t('card.title'),
  };
  return assign({}, headerConfig, overrides);
};

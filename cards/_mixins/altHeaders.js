import { assign } from 'lodash-es';
import sessionClassification from '@/_helpers/sessionClassification.js';

export const personHeader = {
  computed: {
    headerConfig() {
      const { cardState } = this.$root.$options.contextData;
      // let coalitionText;
      // if (this.cardData.data?.person?.group) {
      //   coalitionText = this.cardData.data.person.group.is_coalition
      //     ? this.$t('coalition')
      //     : this.$t('opposition');
      // }
      // console.log(this.cardData.data.person);
      return {
        circlePerson: this.cardData.data?.person,
        heading: this.cardData.data?.person?.name,
        subheading: this.cardData.data?.person?.group?.name,
        // TODO temporarily removed coalition designation in alt header
        // subheading: `${this.cardData.organization?.acronym} | ${coalitionText}`,
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
      // const coalitionText = this.cardData.is_coalition
      //   ? this.$t('coalition')
      //   : this.$t('opposition');
      // console.log(this.cardData);
      return {
        mediaImage: 'party',
        circleColor: this.cardData.data?.group?.color,
        heading: this.cardData.data?.group?.name,
        subheading: this.cardData.data?.group?.acronym,
        // TODO temporarily removed coalition designation in alt header
        // subheading: `${this.cardData.acronym} | ${coalitionText}`,
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

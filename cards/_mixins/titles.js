export const personTitle = {
  created() {
    const { template, cardData } = this.$root.$options.contextData;
    template.pageTitle = `${this.$t('card.title')} - ${cardData?.name}`;
  },
};

export const partyTitle = {
  created() {
    const { template, cardData } = this.$root.$options.contextData;
    const coalitionText = cardData?.is_coalition
      ? this.$t('coalition')
      : this.$t('opposition');
    template.pageTitle = `${this.$t('card.title')} - ${
      cardData?.acronym
    } | ${coalitionText}`;
  },
};

export const searchTitle = {
  created() {
    // const { template } = this.$root.$options.contextData;
    // const keywords = this.keywords || ''; // TODO: get this from contextData not from card
    // template.pageTitle = `Iskalni niz - ${keywords}`; // TODO: translate
  },
};

export const otherVotingsTitle = {
  created() {
    const { template, cardData } = this.$root.$options.contextData;
    template.pageTitle = `Druga glasovanja - ${cardData?.session?.name}`; // TODO: translate
  },
};

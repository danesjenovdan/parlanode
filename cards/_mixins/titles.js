export const personTitle = {
  created() {
    const { template, cardData } = this.$root.$options.contextData;
    const person = cardData?.data?.person || {};
    template.pageTitle = `${this.$t('card.title')} - ${person.name}`;
  },
};

export const partyTitle = {
  created() {
    const { template, cardData } = this.$root.$options.contextData;
    const group = cardData?.data?.group || {};
    let titleText = `${this.$t('card.title')}`;
    titleText += ` - ${group.acronym || group.name || 'N/A'}`;
    if (group.is_in_coalition) {
      titleText += ` | ${this.$t('coalition')}`;
    }
    template.pageTitle = titleText;
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
    // const { template, cardData } = this.$root.$options.contextData;
    // template.pageTitle = `Druga glasovanja - ${cardData?.session?.name}`; // TODO: translate
  },
};

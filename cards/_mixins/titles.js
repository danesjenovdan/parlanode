export const memberTitle = {
  created() {
    const context = this.$root.$options.cardData;
    context.template.pageTitle = `${this.$t('card.title')} - ${context.data.person.name}`;
  },
};

export const partyTitle = {
  created() {
    const context = this.$root.$options.cardData;
    const partyObject = context.data.party || context.data.organization;
    const side = partyObject.is_coalition ? 'koalicija' : 'opozicija';

    context.template.pageTitle = `${this.$t('card.title')} - ${partyObject.acronym} | ${side}`;
  },
};

export const searchTitle = {
  created() {
    const context = this.$root.$options.cardData;
    const keywords = this.keywords || context.data.responseHeader.params.q.split('content_t:')[1].split(')')[0];
    context.template.pageTitle = `Iskalni niz: ${keywords}`;
  },
};

export const memberTitle = {
  created() {
    const context = this.$root.$options.cardData;
    context.template.pageTitle =
      `${context.cardData.name} - ${context.data.person.name}`;
  },
};

export const partyTitle = {
  created() {
    const context = this.$root.$options.cardData;
    const partyObject = context.data.party || context.data.organization;
    const side = partyObject.is_coalition ? 'koalicija' : 'opozicija';

    context.template.pageTitle =
      `${context.cardData.name} - ${partyObject.acronym} | ${side}`;
  },
};

export const searchTitle = {
  created() {
    const context = this.$root.$options.cardData;
    const keywords = this.keywords || context.data.responseHeader.params.q.split('content_t:')[1].split(')')[0];
    context.template.pageTitle = `Iskalni niz: ${keywords}`;
  },
};


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

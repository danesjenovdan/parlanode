export const member = {
  computed: {
    headerConfig() {
      const coalitionText = this.data.person.party.is_coalition ?
        'koalicija' : 'opozicija';

      return {
        circleImage: this.data.person.gov_id,
        heading: this.data.person.name,
        subheading: `${this.data.person.party.acronym} | ${coalitionText}`,
        alternative: this.$options.cardData.cardData.altHeader === 'true',
        title: this.$options.cardData.cardData.name,
      };
    },
  },
};

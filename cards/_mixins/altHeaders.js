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

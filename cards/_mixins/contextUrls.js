export const partyOverview = {
  created() {
    const party = this.$root.$options.cardData.data.party || this.$root.$options.cardData.data.organization;
    this.$root.$options.cardData.template.contextUrl =
      `${this.slugs.base}/poslanska-skupina/${this.slugs.party[party.id].slug}${this.slugs.partyLink.pregled}`;
  },
};

export const partyVotes = {
  created() {
    const party = this.$root.$options.cardData.data.party || this.$root.$options.cardData.data.organization;
    this.$root.$options.cardData.template.contextUrl =
      `${this.slugs.base}/poslanska-skupina/${this.slugs.party[party.id].slug}${this.slugs.partyLink.glasovanja}`;
  },
};

export const partySpeeches = {
  created() {
    const party = this.$root.$options.cardData.data.party || this.$root.$options.cardData.data.organization;
    this.$root.$options.cardData.template.contextUrl =
      `${this.slugs.base}/poslanska-skupina/${this.slugs.party[party.id].slug}${this.slugs.partyLink.govori}`;
  },
};

export const memberOverview = {
  created() {
    this.$root.$options.cardData.template.contextUrl =
      `${this.slugs.base}/poslanec/${this.slugs.person[this.$root.$options.cardData.data.person.id].slug}${this.slugs.personLink.pregled}`;
  },
};

export const memberVotes = {
  created() {
    this.$root.$options.cardData.template.contextUrl =
      `${this.slugs.base}/poslanec/${this.slugs.person[this.$root.$options.cardData.data.person.id].slug}${this.slugs.personLink.glasovanja}`;
  },
};

export const memberSpeeches = {
  created() {
    this.$root.$options.cardData.template.contextUrl =
      `${this.slugs.base}/poslanec/${this.slugs.person[this.$root.$options.cardData.data.person.id].slug}${this.slugs.personLink.govori}`;
  },
};

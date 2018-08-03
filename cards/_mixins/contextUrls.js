export const partyOverview = {
  created() {
    const party = this.$root.$options.cardData.data.party
      || this.$root.$options.cardData.data.organization;
    const slugs = this.$root.$options.cardData.urls;
    this.$root.$options.cardData.template.contextUrl = `${slugs.urls.base}/poslanska-skupina/${slugs.party[party.id].slug}${slugs.partyLink.pregled}`;
  },
};

export const partyVotes = {
  created() {
    const party = this.$root.$options.cardData.data.party
      || this.$root.$options.cardData.data.organization;
    const slugs = this.$root.$options.cardData.urls;
    this.$root.$options.cardData.template.contextUrl = `${slugs.urls.base}/poslanska-skupina/${slugs.party[party.id].slug}${slugs.partyLink.glasovanja}`;
  },
};

export const partySpeeches = {
  created() {
    const party = this.$root.$options.cardData.data.party
      || this.$root.$options.cardData.data.organization;
    const slugs = this.$root.$options.cardData.urls;
    this.$root.$options.cardData.template.contextUrl = `${slugs.urls.base}/poslanska-skupina/${slugs.party[party.id].slug}${slugs.partyLink.govori}`;
  },
};

export const memberOverview = {
  created() {
    const slugs = this.$root.$options.cardData.urls;
    this.$root.$options.cardData.template.contextUrl = `${slugs.urls.base}/poslanec/${slugs.person[this.$root.$options.cardData.data.person.id].slug}${slugs.personLink.pregled}`;
  },
};

export const memberVotes = {
  created() {
    const slugs = this.$root.$options.cardData.urls;
    this.$root.$options.cardData.template.contextUrl = `${slugs.urls.base}/poslanec/${slugs.person[this.$root.$options.cardData.data.person.id].slug}${slugs.personLink.glasovanja}`;
  },
};

export const memberSpeeches = {
  created() {
    const slugs = this.$root.$options.cardData.urls;
    this.$root.$options.cardData.template.contextUrl = `${slugs.urls.base}/poslanec/${slugs.person[this.$root.$options.cardData.data.person.id].slug}${slugs.personLink.govori}`;
  },
};

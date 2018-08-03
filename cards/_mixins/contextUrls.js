export const partyOverview = {
  created() {
    const { template, urls: slugs, data } = this.$root.$options.cardData;
    const party = data.party || data.organization;
    template.contextUrl = `${slugs.urls.base}/ps/${slugs.party[party.id].acronym}`;
  },
};

export const partyVotes = {
  created() {
    const { template, urls: slugs, data } = this.$root.$options.cardData;
    const party = data.party || data.organization;
    template.contextUrl = `${slugs.urls.base}/ps/${slugs.party[party.id].acronym}/glasovanja`;
  },
};

export const partySpeeches = {
  created() {
    const { template, urls: slugs, data } = this.$root.$options.cardData;
    const party = data.party || data.organization;
    template.contextUrl = `${slugs.urls.base}/ps/${slugs.party[party.id].acronym}/govori`;
  },
};

export const memberOverview = {
  created() {
    const { template, urls: slugs, data } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/p/${slugs.person[data.person.id].slug}`;
  },
};

export const memberVotes = {
  created() {
    const { template, urls: slugs, data } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/p/${slugs.person[data.person.id].slug}/glasovanja`;
  },
};

export const memberSpeeches = {
  created() {
    const { template, urls: slugs, data } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/p/${slugs.person[data.person.id].slug}/govori`;
  },
};

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

export const partyList = {
  created() {
    const { template, urls: slugs } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/poslanske-skupine`;
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

export const memberList = {
  created() {
    const { template, urls: slugs } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/poslanci`;
  },
};

export const sessions = {
  created() {
    const { template, urls: slugs } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/seje`;
  },
};

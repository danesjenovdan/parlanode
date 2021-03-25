import links from '@/_mixins/links';

export const partyOverview = {
  created() {
    const { template, urls: slugs, data, siteMap: sm } = this.$root.$options.cardData;
    const party = data.party || data.organization;
    template.contextUrl = `${slugs.urls.base}/${sm.party.base}/${slugs.party[party.id].acronym}`;
  },
};

export const partyVotes = {
  created() {
    const { template, urls: slugs, data, siteMap: sm } = this.$root.$options.cardData;
    const party = data.party || data.organization;
    template.contextUrl = `${slugs.urls.base}/${sm.party.base}/${slugs.party[party.id].acronym}/${sm.party.votings}`;
  },
};

export const partySpeeches = {
  created() {
    const { template, urls: slugs, data, siteMap: sm } = this.$root.$options.cardData;
    const party = data.party || data.organization;
    template.contextUrl = `${slugs.urls.base}/${sm.party.base}/${slugs.party[party.id].acronym}/${sm.party.speeches}`;
  },
};

export const partyList = {
  created() {
    const { template, urls: slugs, siteMap: sm } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/${sm.landing.parties}`;
  },
};

export const memberOverview = {
  created() {
    const { template, urls: slugs, data, siteMap: sm } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/${sm.member.base}/${slugs.person[data.person.id].slug}`;
  },
};

export const memberVotes = {
  created() {
    const { template, urls: slugs, data, siteMap: sm } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/${sm.member.base}/${slugs.person[data.person.id].slug}/${sm.member.votings}`;
  },
};

export const memberSpeeches = {
  created() {
    const { template, urls: slugs, data, siteMap: sm } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/${sm.member.base}/${slugs.person[data.person.id].slug}/${sm.member.speeches}`;
  },
};

export const memberList = {
  created() {
    const { template, urls: slugs, siteMap: sm } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/${sm.landing.members}`;
  },
};

export const sessions = {
  created() {
    const { template, urls: slugs, siteMap: sm } = this.$root.$options.cardData;
    template.contextUrl = `${slugs.urls.base}/${sm.landing.sessions}`;
  },
};

export const search = {
  mixins: [
    links,
  ],
  created() {
    const { template } = this.$root.$options.cardData;
    template.contextUrl = this.getSearchTermLink(this.keywords);
  },
};

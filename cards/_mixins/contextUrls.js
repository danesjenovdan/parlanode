import links from '@/_mixins/links.js';

export const partyOverview = {
  created() {
    const {
      template,
      slugs,
      cardData,
      siteMap: sm,
    } = this.$root.$options.contextData;
    const party = cardData.party || cardData.organization;
    template.contextUrl = `${slugs.urls.base}/${sm.party.base}/${
      slugs.party[party.id].acronym
    }`;
  },
};

export const partyVotes = {
  created() {
    const {
      template,
      slugs,
      cardData,
      siteMap: sm,
    } = this.$root.$options.contextData;
    const party = cardData.party || cardData.organization;
    template.contextUrl = `${slugs.urls.base}/${sm.party.base}/${
      slugs.party[party.id].acronym
    }/${sm.party.votings}`;
  },
};

export const partySpeeches = {
  created() {
    const {
      template,
      slugs,
      cardData,
      siteMap: sm,
    } = this.$root.$options.contextData;
    const party = cardData.party || cardData.organization;
    template.contextUrl = `${slugs.urls.base}/${sm.party.base}/${
      slugs.party[party.id].acronym
    }/${sm.party.speeches}`;
  },
};

export const partyList = {
  created() {
    const { template, slugs, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${slugs.urls.base}/${sm.landing.parties}`;
  },
};

export const memberOverview = {
  created() {
    const {
      template,
      slugs,
      cardData,
      siteMap: sm,
    } = this.$root.$options.contextData;
    template.contextUrl = `${slugs.urls.base}/${sm.member.base}/${cardData?.slug}`;
  },
};

export const memberVotes = {
  created() {
    const {
      template,
      slugs,
      cardData,
      siteMap: sm,
    } = this.$root.$options.contextData;
    template.contextUrl = `${slugs.urls.base}/${sm.member.base}/${
      slugs.person[cardData.person.id].slug
    }/${sm.member.votings}`;
  },
};

export const memberSpeeches = {
  created() {
    const {
      template,
      slugs,
      cardData,
      siteMap: sm,
    } = this.$root.$options.contextData;
    template.contextUrl = `${slugs.urls.base}/${sm.member.base}/${
      slugs.person[cardData.person.id].slug
    }/${sm.member.speeches}`;
  },
};

export const memberList = {
  created() {
    const { template, slugs, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${slugs.urls.base}/${sm.landing.members}`;
  },
};

export const sessions = {
  created() {
    const { template, slugs, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${slugs.urls.base}/${sm.landing.sessions}`;
  },
};

export const search = {
  mixins: [links],
  created() {
    const { template } = this.$root.$options.contextData;
    template.contextUrl = this.getSearchTermLink(this.keywords);
  },
};

export const compass = {
  created() {
    const { template, slugs, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${slugs.urls.base}/${sm.landing.tools}/${sm.tools.compass}`;
  },
};

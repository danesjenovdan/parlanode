import links from '@/_mixins/links.js';

export const partyOverview = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.party.base}/${this.cardData.data?.group?.slug}`;
  },
};

export const partyVotes = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.party.base}/${this.cardData.data?.group?.slug}/${sm.party.votings}`;
  },
};

export const partySpeeches = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.party.base}/${this.cardData.data?.group?.slug}/${sm.party.speeches}`;
  },
};

export const partyList = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.parties}`;
  },
};

export const personOverview = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.member.base}/${this.cardData.data?.person?.slug}`;
  },
};

export const personVotes = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.member.base}/${this.cardData.data?.person?.slug}/${sm.member.votings}`;
  },
};

export const personSpeeches = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.member.base}/${this.cardData.data?.person?.slug}/${sm.member.speeches}`;
  },
};

export const memberList = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.members}`;
  },
};

export const sessions = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.sessions}`;
  },
};

export const search = {
  mixins: [links],
  created() {
    // TODO: context
    // const { template } = this.$root.$options.contextData;
    // template.contextUrl = this.getSearchTermLink(this.keywords);
  },
};

export const compass = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.tools}/${sm.tools.compass}`;
  },
};

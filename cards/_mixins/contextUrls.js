import links from './links.js';

export const partyOverviewContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.party.base}/${this.cardData.data?.group?.slug}/${sm.party.overview}`;
  },
};

export const partyVotesContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.party.base}/${this.cardData.data?.group?.slug}/${sm.party.votings}`;
  },
};

export const partySpeechesContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.party.base}/${this.cardData.data?.group?.slug}/${sm.party.speeches}`;
  },
};

export const partyListContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.parties}`;
  },
};

export const legislationListContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.legislation}`;
  },
};

export const memberListContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.members}`;
  },
};

export const sessionListContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.landing.sessions}`;
  },
};

export const personOverviewContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.member.base}/${this.cardData.data?.person?.slug}`;
  },
};

export const personVotesContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.member.base}/${this.cardData.data?.person?.slug}/${sm.member.votings}`;
  },
};

export const personSpeechesContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.member.base}/${this.cardData.data?.person?.slug}/${sm.member.speeches}`;
  },
};

export const searchContextUrl = {
  created() {
    // TODO: context
    // const { template } = this.$root.$options.contextData;
    // template.contextUrl = this.getSearchTermLink(this.keywords);
  },
};

export const sessionAgendaContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.session.base}/${this.cardData.data?.session?.id}/${sm.session.agenda}`;
  },
};

export const sessionLegislationContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.session.base}/${this.cardData.data?.session?.id}/${sm.session.legislation}`;
  },
};

export const sessionTranscriptContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.session.base}/${this.cardData.data?.session?.id}/${sm.session.transcript}`;
  },
};

export const sessionVotesContextUrl = {
  created() {
    const { template, urls, siteMap: sm } = this.$root.$options.contextData;
    template.contextUrl = `${urls.site}/${sm.session.base}/${this.cardData.data?.session?.id}/${sm.session.otherVotings}`;
  },
};

export const speechSessionTranscriptContextUrl = {
  created() {
    const { template } = this.$root.$options.contextData;
    template.contextUrl = links.methods.getSpeechLink.call(
      this,
      this.cardData.data?.results?.speech || this.cardData.data?.results,
      this.cardData.data?.results?.session
    );
  },
};

export const voteSessionVotesContextUrl = {
  created() {
    const { template } = this.$root.$options.contextData;
    template.contextUrl = links.methods.getVoteLink.call(
      this,
      this.cardData.data?.results,
      this.cardData.data?.results?.session
    );
  },
};

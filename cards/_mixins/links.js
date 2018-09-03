export default {
  methods: {
    getPersonLink(person) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      if (!slugs.person[person.id]) {
        return '';
      }
      return `${slugs.urls.base}/${sm.member.base}/${slugs.person[person.id].slug}`;
    },
    getPersonPortrait(person) {
      const { urls: slugs } = this.$root.$options.cardData;
      return `${slugs.urls.cdn}/img/people/square/${person.gov_id}.png`;
    },
    getPartyLink(party) {
      if (!party.acronym || party.acronym.indexOf('NeP') > -1) {
        return '';
      }
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      if (!slugs.party[party.id]) {
        return '';
      }
      return `${slugs.urls.base}/${sm.party.base}/${slugs.party[party.id].acronym}`;
    },
    getPersonPartyLink(person) {
      return this.getPartyLink(person.party);
    },
    getMemberLink(member) {
      return this.getPersonLink(member.person);
    },
    getMemberPortrait(member) {
      return this.getPersonPortrait(member.person);
    },
    getMemberPartyLink(member) {
      return this.getPersonPartyLink(member.person);
    },
    getMemberPartyIdLink(member) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      if (!slugs.party[member.party_id]) {
        return '';
      }
      return `${slugs.urls.base}/${sm.party.base}/${slugs.party[member.party_id].acronym}`;
    },
    getSessionLegislationLink(session) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.session.base}/${session.id}/${sm.session.legislation}`;
    },
    getSessionTranscriptLink(session) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.session.base}/${session.id}/${sm.session.transcript}`;
    },
    getSessionVotesLink(session) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.session.base}/${session.id}/${sm.session.otherVotings}`;
    },
    getSessionSpeechLink(session) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.session.base}/${session.session_id || session.session.id}/${sm.session.transcript}#${session.speech_id}`;
    },
    getSessionVoteLink(session) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.session.base}/${session.session_id}/${sm.session.vote}/${session.vote_id}`;
    },
    getSearchTermLink(term) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.landing.sessions}/${sm.sessions.search.base}/?q=${encodeURIComponent(`"${term}"`)}`;
    },
    getLegislationLink(legislation) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.landing.legislation}/${legislation.epa || legislation.id}`;
    },
    getLegislationListLink() {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.landing.legislation}`;
    },
  },
};

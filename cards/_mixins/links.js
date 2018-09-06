import { SPEECHES_PER_PAGE } from 'components/constants';

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
    getSessionSpeechLink(speech, perPage = SPEECHES_PER_PAGE) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      const pageNum = Math.floor(speech.the_order / perPage) + 1;
      const pageUrlPart = pageNum > 1 ? `/${pageNum}` : '';
      return `${slugs.urls.base}/${sm.session.base}/${speech.session_id || speech.session.id}/${sm.session.transcript}${pageUrlPart}#${speech.speech_id}`;
    },
    getSessionVoteLink(session) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      return `${slugs.urls.base}/${sm.session.base}/${session.session_id}/${sm.session.vote}/${session.vote_id}`;
    },
    getSearchTermLink(term, { mps = [], pgs = [] } = {}) {
      const { urls: slugs, siteMap: sm } = this.$root.$options.cardData;
      const url = `${slugs.urls.base}/${sm.landing.sessions}/${sm.sessions.search.base}`;
      const query = [
        term && term.length ? `q=${encodeURIComponent(`"${term}"`)}` : '',
        mps && mps.length ? `mps=${mps.join(',')}` : '',
        pgs && pgs.length ? `pgs=${pgs.join(',')}` : '',
      ].filter(Boolean).join('&');
      return `${url}/?${query}`;
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

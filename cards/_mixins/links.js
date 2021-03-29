import { SPEECHES_PER_PAGE } from '@/_helpers/constants.js';

export default {
  methods: {
    getPersonLink(person) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      if (!slugs.person[person.id]) {
        return '';
      }
      return `${slugs.urls.base}/${sm.member.base}/${
        slugs.person[person.id].slug
      }`;
    },
    getPersonPortrait(person) {
      const { slugs } = this.$root.$options.contextData;
      return `${slugs.urls.cdn}/img/people/square/${person.gov_id}.png`;
    },
    getPartyLink(party) {
      if (!party.acronym) {
        return null;
      }
      if ('classification' in party && party.classification !== 'pg') {
        return null;
      }
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      if (!slugs.party[party.id]) {
        return '';
      }
      return `${slugs.urls.base}/${sm.party.base}/${
        slugs.party[party.id].acronym
      }`;
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
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      if (!slugs.party[member.party_id]) {
        return '';
      }
      return `${slugs.urls.base}/${sm.party.base}/${
        slugs.party[member.party_id].acronym
      }`;
    },
    getSessionLegislationLink(session) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      return `${slugs.urls.base}/${sm.session.base}/${session.id}/${sm.session.legislation}`;
    },
    getSessionTranscriptLink(session) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      return `${slugs.urls.base}/${sm.session.base}/${session.id}/${sm.session.transcript}`;
    },
    getSessionVotesLink(session) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      return `${slugs.urls.base}/${sm.session.base}/${session.id}/${sm.session.otherVotings}`;
    },
    getSessionSpeechLink(speech, perPage = SPEECHES_PER_PAGE) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      const pageNum = Math.floor(speech.the_order / perPage) + 1;
      const pageUrlPart = pageNum > 1 ? `/${pageNum}` : '';
      return `${slugs.urls.base}/${sm.session.base}/${
        speech.session_id || speech.session.id
      }/${sm.session.transcript}${pageUrlPart}#${speech.speech_id}`;
    },
    getSpeechCardLink(speech) {
      const { slugs } = this.$root.$options.contextData;
      return `${slugs.urls.glej}/s/govor/${speech.results.speech_id}?frame=true`;
    },
    getSessionVoteLink(session) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      return `${slugs.urls.base}/${sm.session.base}/${session.session_id}/${sm.session.vote}/${session.vote_id}`;
    },
    getSearchTermLink(term, { mps = [], pgs = [] } = {}) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      const url = `${slugs.urls.base}/${sm.landing.sessions}/${sm.sessions.search.base}`;
      const query = [
        term && term.length ? `q=${encodeURIComponent(`${term}`)}` : '',
        mps && mps.length ? `mps=${mps.join(',')}` : '',
        pgs && pgs.length ? `pgs=${pgs.join(',')}` : '',
      ]
        .filter(Boolean)
        .join('&');
      return `${url}/?${query}`;
    },
    getLegislationLink(legislation) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      return `${slugs.urls.base}/${sm.landing.legislation}/${
        legislation.epa || legislation.act_id || legislation.id
      }`;
    },
    getLegislationListLink() {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      return `${slugs.urls.base}/${sm.landing.legislation}`;
    },
    getSessionAgendaLink(agenda, sessionId) {
      const { slugs, siteMap: sm } = this.$root.$options.contextData;
      return `${slugs.urls.base}/${sm.session.base}/${
        sessionId || agenda.session.id
      }/${sm.session.legislation}#${agenda.id}`;
    },
    getAgendaCardLink(agenda) {
      const { slugs } = this.$root.$options.contextData;
      return `${slugs.urls.glej}/s/agenda-item/${agenda.id}?frame=true`;
    },
  },
};

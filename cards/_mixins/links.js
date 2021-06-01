/* eslint-disable no-restricted-properties */
import { SPEECHES_PER_PAGE } from '@/_helpers/constants.js';

export default {
  methods: {
    getPersonLink(person) {
      if (!person.slug) {
        return null;
      }
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.member.base}/${person.slug}`;
    },
    getPersonPortrait(person) {
      return person.image;
    },
    getPartyLink(party) {
      if (!party?.slug) {
        return null;
      }
      if ('classification' in party && party.classification !== 'pg') {
        return null;
      }
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.party.base}/${party.slug}`;
    },
    getSessionLink(session) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.session.base}/${session.id}`;
    },
    getSessionLegislationLink(session) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.session.base}/${session.id}/${sm.session.legislation}`;
    },
    getSessionTranscriptLink(session) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.session.base}/${session.id}/${sm.session.transcript}`;
    },
    getSessionVotesLink(session) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.session.base}/${session.id}/${sm.session.otherVotings}`;
    },
    getSessionSpeechLink(speech, perPage = SPEECHES_PER_PAGE) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      const pageNum = Math.floor(speech.the_order / perPage) + 1;
      const pageUrlPart = pageNum > 1 ? `/${pageNum}` : '';
      return `${urls.site}/${sm.session.base}/${
        speech.session_id || speech.session.id
      }/${sm.session.transcript}${pageUrlPart}#${speech.speech_id}`;
    },
    getSpeechCardLink(speech) {
      const { urls } = this.$root.$options.contextData;
      return `${urls.cards}/s/govor/${speech.results.speech_id}?frame=true`;
    },
    getSessionVoteLink(session) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.session.base}/${session.session_id}/${sm.session.vote}/${session.vote_id}`;
    },
    getSearchTermLink(term, { mps = [], pgs = [] } = {}) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      const url = `${urls.site}/${sm.landing.sessions}/${sm.sessions.search.base}`;
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
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.landing.legislation}/${
        legislation.epa || legislation.act_id || legislation.id
      }`;
    },
    getLegislationListLink() {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.landing.legislation}`;
    },
    getSessionAgendaLink(agenda, sessionId) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.session.base}/${
        sessionId || agenda.session.id
      }/${sm.session.legislation}#${agenda.id}`;
    },
    getAgendaCardLink(agenda) {
      const { urls } = this.$root.$options.contextData;
      return `${urls.cards}/s/agenda-item/${agenda.id}?frame=true`;
    },
  },
};

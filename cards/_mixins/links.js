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
      return (
        person?.image ||
        'https://cdn.nov.parlameter.si/v1/parlassets/img/people/square/null.png'
      );
    },
    getPartyLink(party) {
      if (!party?.slug) {
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
      if (!session?.id) {
        return null;
      }
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      return `${urls.site}/${sm.session.base}/${session.id}/${sm.session.otherVotings}`;
    },
    getSpeechLink(speech, session, perPage = SPEECHES_PER_PAGE) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      const sessId = session?.id || speech?.session?.id || speech?.session_id;
      const pageNum = Math.floor(speech.the_order / perPage) + 1;
      const pageUrlPart = pageNum > 1 ? `/${pageNum}` : '';
      return `${urls.site}/${sm.session.base}/${sessId}/${sm.session.transcript}${pageUrlPart}#${speech.id}`;
    },
    getSpeechCardLink(speech) {
      const { urls } = this.$root.$options.contextData;
      return `${urls.cards}/speech/single/${speech.id}?frame=true`;
    },
    getVoteLink(vote, session) {
      const { urls, siteMap: sm } = this.$root.$options.contextData;
      const sessId = session?.id || vote?.session?.id || vote?.session_id;
      return `${urls.site}/${sm.session.base}/${sessId}/${sm.session.vote}/${vote?.id}`;
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
      return `${urls.site}/${sm.landing.legislation}/${legislation.id}`;
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

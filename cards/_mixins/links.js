import { PORTRAIT_ROOT_URL } from '../_components/constants';

export default {
  methods: {
    getPersonLink(person) {
      if (!this.slugs.person[person.id]) {
        return '';
      }
      return `${this.slugs.urls.base}/p/${this.slugs.person[person.id].slug}`;
    },
    getPersonPortrait(person) {
      return `${PORTRAIT_ROOT_URL}${person.gov_id}.png`;
    },
    getPartyLink(party) {
      if (!party.acronym || party.acronym.indexOf('NeP') > -1) {
        return '';
      }
      if (!this.slugs.party[party.id]) {
        return '';
      }
      return `${this.slugs.urls.base}/ps/${this.slugs.party[party.id].acronym}`;
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
      if (!this.slugs.party[member.party_id]) {
        return '';
      }
      return `${this.slugs.urls.base}/ps/${this.slugs.party[member.party_id].acronym}`;
    },
    getSessionTranscriptLink(session) {
      return `${this.slugs.urls.base}/seja/${session.id}/transkript`;
    },
    getSessionVotesLink(session) {
      return `${this.slugs.urls.base}/seja/${session.id}/glasovanja`;
    },
    getSessionSpeechLink(session) {
      return `${this.slugs.urls.base}/seja/${session.session_id || session.session.id}/transkript#${session.speech_id}`;
    },
    getSessionVoteLink(session) {
      return `${this.slugs.urls.base}/seja/${session.session_id}/glasovanje/${session.vote_id}`;
    },
    getSearchTermLink(term) {
      return `${this.slugs.urls.base}/seje/isci/filter?q=${encodeURIComponent(`"${term}"`)}`;
    },
  },
};

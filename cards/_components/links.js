import urlsData from '../../assets/urls.json';
import { PORTRAIT_ROOT_URL, SEARCH_ROOT_URL } from './constants';

export const getPersonLink = person => (
  urlsData.urls.base
  + urlsData.personLink.base
  + (typeof urlsData.person[person.id] !== 'undefined' ? urlsData.person[person.id].slug : '')
  + urlsData.personLink.pregled
);

export const getPersonPortrait = person => `${PORTRAIT_ROOT_URL}${person.gov_id}.png`;

export const getPartyLink = (party) => {
  if (!party.acronym || party.acronym.indexOf('NeP') > -1) {
    return '';
  }
  return urlsData.urls.base
         + urlsData.partyLink.base
         + urlsData.party[party.id].acronym
         + urlsData.partyLink.pregled;
};

export const getPersonPartyLink = person => getPartyLink(person.party);

export const getMemberLink = member => getPersonLink(member.person);
export const getMemberPortrait = member => getPersonPortrait(member.person);
export const getMemberPartyLink = member => getPersonPartyLink(member.person);
export const getMemberPartyIdLink = member => `${urlsData.urls.base}${urlsData.partyLink.base}${urlsData.party[member.party_id].acronym}${urlsData.partyLink.pregled}`;

export const getSessionTranscriptLink = session => `${urlsData.urls.base}${urlsData.sessionLink.transkript}${session.id}`;
export const getSessionVotesLink = session => `${urlsData.urls.base}${urlsData.sessionLink.glasovanja}${session.id}`;

export const getSessionSpeechLink = session => `${urlsData.urls.base}${urlsData.sessionLink.transkript}${session.session_id || session.session.id}#${session.speech_id}`;
export const getSessionVoteLink = session => `${urlsData.urls.base}${urlsData.sessionLink.glasovanje}${session.session_id}/${session.vote_id}`;

export const getSearchTermLink = term => SEARCH_ROOT_URL + encodeURIComponent(`"${term}"`);

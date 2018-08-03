import slugs from '../../data/urls.json'; // TODO: urls
import { PORTRAIT_ROOT_URL } from './constants';

export const getPersonLink = person => (
  slugs.urls.base
  + slugs.personLink.base
  + (typeof slugs.person[person.id] !== 'undefined' ? slugs.person[person.id].slug : '')
  + slugs.personLink.pregled
);

export const getPersonPortrait = person => `${PORTRAIT_ROOT_URL}${person.gov_id}.png`;

export const getPartyLink = (party) => {
  if (!party.acronym || party.acronym.indexOf('NeP') > -1) {
    return '';
  }
  if (!slugs.party[party.id]) {
    return '';
  }
  return slugs.urls.base
         + slugs.partyLink.base
         + slugs.party[party.id].acronym
         + slugs.partyLink.pregled;
};

export const getPersonPartyLink = person => getPartyLink(person.party);

export const getMemberLink = member => getPersonLink(member.person);
export const getMemberPortrait = member => getPersonPortrait(member.person);
export const getMemberPartyLink = member => getPersonPartyLink(member.person);
export const getMemberPartyIdLink = member => `${slugs.urls.base}${slugs.partyLink.base}${slugs.party[member.party_id].acronym}${slugs.partyLink.pregled}`;

export const getSessionTranscriptLink = session => `${slugs.urls.base}${slugs.sessionLink.transkript}${session.id}`;
export const getSessionVotesLink = session => `${slugs.urls.base}${slugs.sessionLink.glasovanja}${session.id}`;

export const getSessionSpeechLink = session => `${slugs.urls.base}${slugs.sessionLink.transkript}${session.session_id || session.session.id}#${session.speech_id}`;
export const getSessionVoteLink = session => `${slugs.urls.base}${slugs.sessionLink.glasovanje}${session.session_id}/${session.vote_id}`;

export const getSearchTermLink = term => `${slugs.urls.base}/seje/isci/filter?q=${encodeURIComponent(`"${term}"`)}`;

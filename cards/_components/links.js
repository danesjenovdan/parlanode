import urlsData from '../../assets/urls.json';
import { PORTRAIT_ROOT_URL } from './constants.js';

export const getPersonLink = person =>
  urlsData.base +
  urlsData.personLink.base +
  urlsData.person[person.id].slug +
  urlsData.personLink.pregled;

export const getPersonPortrait = person =>
  `${PORTRAIT_ROOT_URL}${person.gov_id}.png`;

export const getPartyLink = (party) => {
  if (party.acronym.indexOf('NeP') > -1) return '';

  return urlsData.base +
         urlsData.partyLink.base +
         urlsData.party[party.id].acronym +
         urlsData.partyLink.pregled;
};

export const getPersonPartyLink = person => getPartyLink(person.party);

export const getMemberLink = member => getPersonLink(member.person);
export const getMemberPortrait = member => getPersonPortrait(member.person);

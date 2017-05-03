import urlsData from '../../assets/urls.json';
import { PORTRAIT_ROOT_URL } from './constants.js';

export const getPersonLink = member =>
  urlsData.base +
  urlsData.personLink.base +
  urlsData.person[member.person.id].slug +
  urlsData.personLink.pregled;

export const getPersonPortrait = member =>
  `${PORTRAIT_ROOT_URL}${member.person.gov_id}.png`;

export const getPartyLink = (party) => {
  if (party.acronym.indexOf('NeP') > -1) return '';

  return urlsData.base +
         urlsData.partyLink.base +
         urlsData.party[party.id].acronym +
         urlsData.partyLink.pregled;
};

export const getMemberPartyLink = member => getPartyLink(member.person.party);

import urlsData from '../../assets/urls.json';

export const getPersonLink = member =>
  urlsData.base +
  urlsData.personLink.base +
  urlsData.person[member.person.id].slug +
  urlsData.personLink.pregled;

export const getPartyLink = (member) => {
  if (member.person.party.acronym.indexOf('NeP') === -1) return '';

  return urlsData.base +
         urlsData.partyLink.base +
         urlsData.party[member.person.party.id].acronym +
         urlsData.partyLink.pregled;
};

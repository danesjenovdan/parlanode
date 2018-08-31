import axios from 'axios';
import parlapiConfig from './parlapi-config.json';

function parlapi() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const slugs = this.$root.$options.cardData.urls;
  const locale = this.$root.$i18n.locale;
  const config = parlapiConfig[locale];
  const dataToken = localStorage.getItem('data_token');
  const analizeToken = localStorage.getItem('analize_token');
  // TODO: function that uses refresh token to get new access token
  /*
    something like:

    function retry(func) {
      func()
        .then(res => {
          if (res.status ~= 4xx) {
            return getNewToken() // either use refresh token or prompt for user/pass
              .then(func)
          }
          return res
        })
    }

  */

  const data = axios.create({
    baseURL: slugs.urls.data,
    headers: {
      Authorization: `Bearer ${dataToken}`,
    },
  });

  const analize = axios.create({
    baseURL: slugs.urls.analize,
    headers: {
      Authorization: `Bearer ${analizeToken}`,
    },
  });

  return {
    getSessions() {
      return data.get(`/sessions/?limit=10000&organization=${config.parliament_id}&ordering=-start_time`);
    },
    getSessionTFIDF(sessionId) {
      return analize.get(`/s/tfidfs/?session__id_parladata=${sessionId}`);
    },
    patchSessionTFIDF(id, tfidf) {
      return analize.patch(`/s/tfidfs/${id}`, tfidf);
    },
    updateSession(id) {
      return analize.get(`/s/setMotionOfSession/${id}?key=nekijabolteskega`); // TODO: this key?
    },
    getVotings(sessionId) {
      return data.get(`/votes/?session=${sessionId}&limit=10000&organization=${config.parliament_id}&ordering=-start_time`);
    },
    patchVoting(id, voting) {
      return data.patch(`/votes/${id}`, voting);
    },
    getMotions(sessionId) {
      return data.get(`/motions/?session=${sessionId}&limit=10000&organization=${config.parliament_id}&ordering=-start_time`);
    },
    patchMotion(id, motion) {
      return data.patch(`/motions/${id}`, motion);
    },
    getTags() {
      return data.get('/tags/?limit=10000');
    },
    getVotingAbstract(votingId) {
      return analize.get(`/s/vote-notes/?id_parladata=${votingId}`);
    },
    patchVotingAbstract(id, abstract) {
      return analize.patch(`/s/vote-notes/${id}`, abstract);
    },
    getPeople() {
      return data.get('/persons/?limit=10000');
    },
    getPeopleMpsOnly() {
      return data.get('/persons/?limit=10000&mps=true');
    },
    patchPerson(id, person) {
      return data.patch(`/persons/${id}`, person);
    },
    getPersonTFIDF(personId) {
      return analize.get(`/p/tfidfs/?person__id_parladata=${personId}`);
    },
    patchPersonTFIDF(id, tfidf) {
      return analize.patch(`/p/tfidfs/${id}`, tfidf);
    },
    getPersonSocialLinks(personId) {
      return data.get(`/links/?tags__name=social&person=${personId}`);
    },
    patchLink(id, link) {
      return data.patch(`/links/${id}/`, link); // needs trailing slash or it doesnt work ??
    },
    getLegislation() {
      return analize.get('/s/legislations/?limit=10000');
    },
    patchLegislation(id, legislation) {
      return analize.patch(`/s/legislations/${id}`, legislation);
    },

    // organisations
    getParties() {
      return data.get('/organizations/?classification=Party&limit=10000');
    },
    getAllOrganisations() {
      return data.get('/organizations/?limit=10000');
    },
    getOrganisationSocialLinks(orgId) {
      return data.get(`/links/?tags__name=social&organization=${orgId}`);
    },
    patchOrganisation(id, org) {
      return data.patch(`/organizations/${id}`, org);
    },
    getOrganisationTFIDF(orgId) {
      return analize.get(`/pg/tfidfs/?organization__id_parladata=${orgId}`);
    },
    patchOrganisationTFIDF(id, tfidf) {
      return analize.patch(`/pg/tfidfs/${id}`, tfidf);
    },
    getOrganisationMemberships(orgId) {
      return data.get(`memberships/?organization=${orgId}`);
    },
  };
}

export default {
  created() {
    const $parlapi = parlapi.call(this);
    Object.defineProperty(this, '$parlapi', {
      get() {
        return $parlapi;
      },
    });
  },
};

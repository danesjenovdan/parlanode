import axios from 'axios';

function parlapi() {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const { urls: slugs, cardGlobals } = this.$root.$options.cardData;
  const tokens = {
    data: {
      url: localStorage.getItem('data_url'),
      basic: localStorage.getItem('data_basic'),
      token: localStorage.getItem('data_token'),
      refresh: localStorage.getItem('data_refresh'),
      expires: localStorage.getItem('data_expires'),
    },
    analize: {
      url: localStorage.getItem('analize_url'),
      basic: localStorage.getItem('analize_basic'),
      token: localStorage.getItem('analize_token'),
      refresh: localStorage.getItem('analize_refresh'),
      expires: localStorage.getItem('analize_expires'),
    },
  };

  function shouldRefreshToken(expiry) {
    return Date.now() > (expiry - (1000 * 60 * 10)); // 10 min before expiry
  }

  function refreshToken(obj, key) {
    return axios.post(obj.url, {
      grant_type: 'refresh_token',
      refresh_token: obj.refresh,
    }, {
      headers: {
        Authorization: `Basic ${obj.basic}`,
      },
    })
      .then((res) => {
        localStorage.setItem(`${key}_token`, obj.token = res.data.access_token);
        localStorage.setItem(`${key}_refresh`, obj.refresh = res.data.refresh_token);
        localStorage.setItem(`${key}_expires`, obj.expires = Date.now() + (res.data.expires_in * 1000));
      })
      .catch((error) => {
        // eslint-disable-next-line no-console
        console.error(error);
        // eslint-disable-next-line no-alert
        alert('ERROR! Please logout and log back in!');
      });
  }

  const data = axios.create({
    baseURL: slugs.urls.data,
  });

  data.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${tokens.data.token}`;
    if (shouldRefreshToken(tokens.data.expires)) {
      return refreshToken(tokens.data, 'data')
        .then(() => {
          config.headers.Authorization = `Bearer ${tokens.data.token}`;
          return config;
        });
    }
    return config;
  });

  const analize = axios.create({
    baseURL: slugs.urls.analize,
  });

  analize.interceptors.request.use((config) => {
    config.headers.Authorization = `Bearer ${tokens.analize.token}`;
    if (shouldRefreshToken(tokens.analize.expires)) {
      return refreshToken(tokens.analize, 'analize')
        .then(() => {
          config.headers.Authorization = `Bearer ${tokens.analize.token}`;
          return config;
        });
    }
    return config;
  });

  const glej = axios.create({
    baseURL: slugs.urls.glej,
  });

  return {
    // sessions
    getSessions(orgId = cardGlobals.parliament_id) {
      return data.get(`/sessions/?limit=10000&organization=${orgId}&ordering=-start_time`);
    },
    getSession(id) {
      return data.get(`/sessions/?id=${id}`);
    },
    getSessionTFIDF(sessionId) {
      return analize.get(`/s/tfidfs/?session__id_parladata=${sessionId}`);
    },
    patchSessionTFIDF(id, tfidf) {
      tfidf.is_visible = true;
      return analize.patch(`/s/tfidfs/${id}/`, tfidf);
    },
    updateSession(id) {
      return analize.get(`/s/setMotionOfSession/${id}?key=nekijabolteskega`); // TODO: this key?
    },
    // votings
    getVotings(sessionId) {
      return data.get(`/votes/?session=${sessionId}&limit=10000&ordering=-start_time`);
    },
    getUntaggedVotings() {
      return data.get(`/untagged_votes/?limit=10000&ordering=-start_time`);
    },
    patchVoting(id, voting) {
      return data.patch(`/votes/${id}/`, voting);
    },
    getMotions(sessionId) {
      return data.get(`/motions/?session=${sessionId}&limit=10000&ordering=-start_time`);
    },
    patchMotion(id, motion) {
      return data.patch(`/motions/${id}/`, motion);
    },
    getTags() {
      return data.get('/tags/?limit=10000');
    },
    postTag(tag) {
      return data.post('/tags/', tag);
    },
    getVotingAbstract(votingId) {
      return analize.get(`/s/vote-notes/?id_parladata=${votingId}`);
    },
    patchVotingAbstract(id, abstract) {
      return analize.patch(`/s/vote-notes/${id}/`, abstract);
    },
    // people
    getPeople() {
      return data.get('/persons/?limit=10000');
    },
    getPeopleMpsOnly() {
      return data.get('/persons/?limit=10000&mps=true');
    },
    getPeopleVotersOf(orgId) {
      return data.get(`/persons/?limit=10000&voters_of=${orgId}`);
    },
    patchPerson(id, person) {
      return data.patch(`/persons/${id}/`, person);
    },
    getPersonTFIDF(personId) {
      return analize.get(`/p/tfidfs/?person__id_parladata=${personId}`);
    },
    patchPersonTFIDF(id, tfidf) {
      tfidf.is_visible = true;
      return analize.patch(`/p/tfidfs/${id}/`, tfidf);
    },
    getPersonSocialLinks(personId) {
      return data.get(`/links/?tags__name=social&person=${personId}&limit=10000`);
    },
    patchLink(id, link) {
      return data.patch(`/links/${id}/`, link); // needs trailing slash or it doesnt work ??
    },
    postLink(link) {
      return data.post('/links/', link);
    },
    deleteLink(id) {
      return data.delete(`/links/${id}/`);
    },
    // legislation
    getLegislation() {
      return analize.get('/s/legislations/?limit=10000');
    },
    patchLegislation(id, legislation) {
      return analize.patch(`/s/legislations/${id}/`, legislation);
    },
    // organisations
    getParties() {
      return data.get('/organizations/?classification=Party&limit=10000');
    },
    getAllOrganisations() {
      return data.get('/organizations/?limit=10000');
    },
    getOrganisationSocialLinks(orgId) {
      return data.get(`/links/?tags__name=social&organization=${orgId}&limit=10000`);
    },
    patchOrganisation(id, org) {
      return data.patch(`/organizations/${id}/`, org);
    },
    getOrganisationTFIDF(orgId) {
      return analize.get(`/pg/tfidfs/?organization__id_parladata=${orgId}`);
    },
    patchOrganisationTFIDF(id, tfidf) {
      tfidf.is_visible = true;
      return analize.patch(`/pg/tfidfs/${id}/`, tfidf);
    },
    getOrganisationMemberships(orgId) {
      return data.get(`/memberships/?organization=${orgId}&limit=10000`);
    },
    getPersonMemberships(personId) {
      return data.get(`/memberships/?person=${personId}&limit=10000`);
    },
    patchMembership(id, membership) {
      return data.patch(`/memberships/${id}/`, membership);
    },
    postMembership(membership) {
      return data.post('/memberships/', membership);
    },
    deleteMembership(id) {
      return data.delete(`/memberships/${id}/`);
    },
    getOrganisationContactEmails(orgId) {
      return data.get(`/contact_detail/?contact_type=EMAIL&organization=${orgId}&limit=10000`);
    },
    patchContact(id, contact) {
      return data.patch(`/contact_detail/${id}/`, contact);
    },
    postContact(contact) {
      return data.post('/contact_detail/', contact);
    },
    deleteContact(id) {
      return data.delete(`/contact_detail/${id}/`);
    },
    getLegislationIcons() {
      return glej.get('/api/icons/legislation');
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

import axios from 'axios';
import parlapiConfig from './parlapi-config.json';

function parlapi() {
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
      return data.get(`/sessions/?limit=1000&organization=${config.parliament_id}&ordering=-start_time`);
    },
    getSessionTFIDF(id) {
      return analize.get(`/s/tfidfs/?session__id_parladata=${id}`);
    },
    patchSessionsTFIDF(tfidf) {
      return analize.patch(`/s/tfidfs/${tfidf.id}`, tfidf);
    },
    updateSession(id) {
      return analize.get(`/s/setMotionOfSession/${id}?key=nekijabolteskega`); // TODO: this key?
    },
  };
}

export default {
  created() {
    Object.defineProperty(this, '$parlapi', {
      get() {
        return parlapi.call(this);
      },
    });
  },
};

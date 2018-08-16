import axios from 'axios';
import parlapiConfig from './parlapi-config.json';

function parlapi() {
  const slugs = this.$root.$options.cardData.urls;
  const locale = this.$root.$i18n.locale;
  const config = parlapiConfig[locale];
  const token = localStorage.getItem('access_token');

  const data = axios.create({
    baseURL: slugs.urls.data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  const analize = axios.create({
    baseURL: slugs.urls.analize,
  });

  return {
    getSessions() {
      return data.get(`/sessions/?limit=1000&organization=${config.parliament_id}&ordering=-start_time`);
    },
    getSessionTFIDF(id) {
      return analize.get(`/s/tfidfs/?session__id_parladata=${id}`);
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

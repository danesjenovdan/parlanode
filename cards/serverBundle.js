import Vue from 'vue';
import request from 'request';
import SearchDropdown from 'parlassets/components/SearchDropdown.vue';
// eslint-disable-next-line
import Card from 'cardPath/card.vue';

global.$ = {
  getJSON(url, callback) {
    request(url, (error, response, body) => {
      if (error) throw error;
      callback(JSON.parse(body));
    });
  },
  get(url, callback) {
    request(url, (error, response, body) => {
      if (error) throw error;
      callback(body);
    });
  },
};
Vue.component('SearchDropdown', SearchDropdown);

// the default export should be a function
// which will receive the context of the render call
export default (cardData) => {
  const app = new Vue(Object.assign({}, Card, { cardData }));

  return new Promise(resolve => resolve(app));
};

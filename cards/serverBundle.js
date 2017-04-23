import Vue from 'vue';
import request from 'request';
import SearchDropdown from 'parlassets/components/SearchDropdown.vue';
import Tabs from 'parlassets/components/Tabs.vue';
import Tab from 'parlassets/components/Tab.vue';
// eslint-disable-next-line
import Card from 'cardPath/card.vue';

global.$ = {
  getJSON(url, callback) {
    request(url, (error, response, body) => {
      if (error) throw error;
      callback(JSON.parse(body));
    });
  },
};
Vue.component('SearchDropdown', SearchDropdown);
Vue.component('Tabs', Tabs);
Vue.component('Tab', Tab);

// the default export should be a function
// which will receive the context of the render call
export default (cardData) => {
  const app = new Vue(Object.assign({}, Card, { cardData }));

  return new Promise(resolve => resolve(app));
};

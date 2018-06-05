import Vue from 'vue';
import VueI18n from 'vue-i18n';
import request from 'request';
import { merge } from 'lodash';
import SearchDropdown from 'parlassets/components/SearchDropdown.vue';
import Card from 'cardPath/card.vue';

import i18nDefault from 'i18n/defaults.json';
let i18nCard = {}
try {
  i18nCard = require('i18n/card.json');
} catch(e) {}

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: process.env.CARD_LANG,
  messages: merge({}, i18nDefault, i18nCard),
});

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
export default (context) => {
  // console.log('logging what came in');
  // console.log(context);

  // const cardState = JSON.parse(JSON.stringify(context.parlaState));

  // THIS NEEDS A REWORK BECAUSE BRAINFUCK
  context.state = {
    data: context.data,
    cardData: context.cardData,
    parlaState: context.parlaState,
  };

  // console.log('logging what goes out');
  // console.log(context);

  const app = new Vue(Object.assign({}, Card, { cardData: context, i18n }));
  return new Promise(resolve => resolve(app));
};

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from 'lodash';
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';
import data from 'cardPath/data.json';
import parlaState from 'cardPath/state.json';
import i18nDefault from 'i18n/defaults.json';
let i18nCard = {}
try {
  i18nCard = require('i18n/card.json');
} catch(e) {}

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: process.env.CARD_LANG || 'sl',
  messages: _.merge({}, i18nDefault, i18nCard),
});

const fakeCardData = {
  cardData: {
    data,
    parlaState,
    cardData: {
      altHeader: window.location.href.indexOf('altHeader=true') !== -1 ? 'true' : false,
      ...cardData,
    },
  },
  i18n,
};

window.app = new Vue(Object.assign({}, Card, fakeCardData));
window.app.$mount('#app');

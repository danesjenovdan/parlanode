import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { merge } from 'lodash';
/* eslint-disable import/no-unresolved */
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';
import data from 'cardPath/data.json';
import parlaState from 'cardPath/state.json';
import i18nDefault from 'i18n/defaults.json';
import i18nCard from 'i18n/card.json';
/* eslint-enable import/no-unresolved */
import urls from '../data/urls.json';

Vue.use(VueI18n);

const locale = process.env.CARD_LANG;
const i18n = new VueI18n({
  locale: process.env.CARD_LANG || 'sl',
  messages: {
    [locale]: merge({}, i18nDefault, i18nCard),
  },
});

const fakeCardData = {
  cardData: {
    data,
    parlaState,
    cardData: {
      altHeader: window.location.href.indexOf('altHeader=true') !== -1 ? 'true' : false,
      ...cardData,
    },
    urls,
  },
  i18n,
};

window.app = new Vue(Object.assign({}, Card, fakeCardData));
window.app.$mount('#app');

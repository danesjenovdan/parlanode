/* global Vue, VueI18n */
import { merge, assign } from 'lodash';
/* eslint-disable import/no-unresolved */
import Card from 'cardPath/card.vue';
import cardJson from 'cardPath/card.json';
import data from 'cardPath/data.json';
import parlaState from 'cardPath/state.json';
import i18nDefault from 'i18n/defaults.json';
import i18nCard from 'i18n/card.json';
/* eslint-enable import/no-unresolved */
import urls from '../data/urls.json';
import siteMap from '../data/siteMap.json';
import config from '../config';

Vue.use(VueI18n);

const locale = process.env.CARD_LANG;
const i18n = new VueI18n({
  locale: process.env.CARD_LANG || 'sl',
  messages: {
    [locale]: merge({}, i18nDefault, i18nCard),
  },
});

const cardData = {
  data,
  cardData: {
    altHeader: window.location.href.indexOf('altHeader=true') !== -1 ? 'true' : false,
    ...cardJson,
  },
  parlaState,
  urls,
  siteMap,
  cardGlobals: config.cardGlobals || {},
};

window.app = new Vue(assign({}, Card, { cardData, i18n }));
window.app.$mount('#app');

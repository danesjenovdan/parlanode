/* global Vue, VueI18n */
/* eslint-disable no-underscore-dangle */
import _ from 'lodash';
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';

import i18nDefault from 'i18n/defaults.json';
let i18nCard = {}
try {
  i18nCard = require('i18n/card.json');
} catch(e) {}

const i18n = new VueI18n({
  locale: process.env.CARD_LANG,
  messages: _.merge({}, i18nDefault, i18nCard),
});

const app = new Vue(Object.assign({}, Card, { cardData: window.__INITIAL_STATE__, i18n }));

app.$mount(`#${cardData._id}`);

/* global Vue, VueI18n */
/* eslint-disable no-underscore-dangle */
import { merge, assign } from 'lodash';
/* eslint-disable import/no-unresolved */
import Card from 'cardPath/card.vue';
import cardData from 'cardPath/card.json';
import i18nDefault from 'i18n/defaults.json';
import i18nCard from 'i18n/card.json';
/* eslint-enable import/no-unresolved */

const locale = process.env.CARD_LANG;
const i18n = new VueI18n({
  locale,
  messages: {
    [locale]: merge({}, i18nDefault, i18nCard),
  },
});

const app = new Vue(assign({}, Card, { ...window.__INITIAL_STATE__, i18n }));

app.$mount(`#${cardData._id}`);

/* global Vue, VueI18n */
/* eslint-disable no-underscore-dangle */
import { merge } from 'lodash';
/* eslint-disable import/no-unresolved */
import OuterCardWrapper from 'components/Card/OuterWrapper.vue';
import Card from 'cardPath/card.vue';
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

const app = new Vue({
  render(h) {
    return h(OuterCardWrapper, [
      h(Card),
    ]);
  },
  ...window.__INITIAL_STATE__,
  i18n,
});
app.$mount(`#${window.__INITIAL_STATE__.cardData.mountId}`);

import Vue from 'vue';
import VueI18n from 'vue-i18n';
import _ from 'lodash';
/* eslint-disable import/no-unresolved */
import Card from 'cardPath/card.vue';
import i18nDefault from 'i18n/defaults.json';
import i18nCard from 'i18n/card.json';
/* eslint-enable import/no-unresolved */

Vue.use(VueI18n);

const locale = process.env.CARD_LANG;
const i18n = new VueI18n({
  locale,
  messages: {
    [locale]: _.merge({}, i18nDefault, i18nCard),
  },
});

// the default export should be a function
// which will receive the context of the render call
export default (context) => {
  const cardData = {
    data: context.data,
    cardData: context.cardData,
    parlaState: context.parlaState,
    urls: context.urls,
    siteMap: context.siteMap,
  };

  // This gets passed to client as state
  context.state = {
    cardData,
  };

  const app = new Vue(Object.assign({}, Card, { cardData, i18n }));
  return new Promise(resolve => resolve(app));
};

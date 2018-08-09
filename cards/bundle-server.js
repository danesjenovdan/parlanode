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
  // we pass `context` as the `cardData` property directly so vue components can
  // change and add data to the `cardData` object that we need for rendering the
  // html template which uses `context` as the context
  const serverContext = {
    cardData: context,
    i18n,
  };

  // we don't pass `context` as `cardData` directly because client state is
  // serialized as json and that would fail due to circular references
  const clientContext = {
    cardData: {
      data: context.data,
      cardData: context.cardData,
      parlaState: context.parlaState,
      urls: context.urls,
      siteMap: context.siteMap,
    },
    // i18n is added in bundle-client.js
  };

  // context.state is passed to the client
  context.state = clientContext;

  const app = new Vue(Object.assign({}, Card, serverContext));
  return new Promise(resolve => resolve(app));
};

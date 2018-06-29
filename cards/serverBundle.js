import Vue from 'vue';
import VueI18n from 'vue-i18n';
import { merge } from 'lodash';
import SearchDropdown from 'components/SearchDropdown.vue';
/* eslint-disable import/no-unresolved */
import Card from 'cardPath/card.vue';
import i18nDefault from 'i18n/defaults.json';
import i18nCard from 'i18n/card.json';
/* eslint-enable import/no-unresolved */

Vue.use(VueI18n);

const i18n = new VueI18n({
  locale: process.env.CARD_LANG,
  messages: merge({}, i18nDefault, i18nCard),
});

Vue.component('SearchDropdown', SearchDropdown);

// the default export should be a function
// which will receive the context of the render call
export default (context) => {
  // THIS NEEDS A REWORK BECAUSE BRAINFUCK
  // TODO: you can get custom url here
  context.state = {
    data: context.data,
    cardData: context.cardData,
    parlaState: context.parlaState,
  };

  const app = new Vue(Object.assign({}, Card, { cardData: context, i18n }));
  return new Promise(resolve => resolve(app));
};

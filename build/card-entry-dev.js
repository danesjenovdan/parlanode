import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { merge, assign } from 'lodash';
/* eslint-disable import/no-unresolved, no-underscore-dangle */
import Card from './card.vue'; // TODO
import cardJson from './card.json';
import data from './data.json';
import parlaState from './state.json';
import i18nDefault from '../../_i18n/sl/defaults.json';
import i18nCard from '../../_i18n/sl/{cardName}.json';
import urls from '../../../data/urls.json';
import siteMap from '../../../data/siteMap.json';
/* eslint-enable import/no-unresolved */
// import config from '../config';

const locale = import.meta.env.CARD_LANG || 'sl';
const i18n = createI18n({
  locale: import.meta.env.CARD_LANG || 'sl',
  messages: {
    [locale]: merge({}, i18nDefault, i18nCard),
  },
});

const cardData = {
  mountId: `${cardJson._id}__${Date.now().toString(36)}`,
  data,
  cardData: {
    altHeader:
      window.location.href.indexOf('altHeader=true') !== -1 ? 'true' : false,
    ...cardJson,
  },
  parlaState,
  urls,
  siteMap,
  cardGlobals: /* config.cardGlobals || */ {},
};

window.card = createApp(assign({}, Card, { cardData }));
window.card.use(i18n);
window.card.mount('#card');

window.card._container.parentElement.className =
  window.card._component.cardData.template.frameContainerClass;

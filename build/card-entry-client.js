import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { merge } from 'lodash-es';
/* eslint-disable import/no-unresolved */
import Card from '@/{cardName}/card.vue';
/* eslint-enable import/no-unresolved */

// eslint-disable-next-line no-underscore-dangle
const { contextData, i18nData } = window.__INITIAL_STATE__;

const { locale, i18nDefault, i18nCard } = i18nData;
const i18n = createI18n({
  locale,
  messages: {
    [locale]: merge({}, i18nDefault, i18nCard),
  },
});

const app = createApp({ ...Card, contextData });
app.use(i18n);
app.mount(`#${contextData.mountId}`);

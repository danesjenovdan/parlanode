import { createSSRApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { renderToString } from '@vue/server-renderer';
import { merge } from 'lodash-es';
/* eslint-disable import/no-unresolved */
import Card from '@/{cardName}/card.vue';
/* eslint-enable import/no-unresolved */

export default async (contextData, i18nData) => {
  const { locale, defaultMessages, cardMessages } = i18nData;
  const i18n = createI18n({
    locale,
    messages: {
      [locale]: merge({}, defaultMessages, cardMessages),
    },
  });

  const app = createSSRApp({ ...Card, contextData });
  app.use(i18n);

  const ctx = {};
  const html = await renderToString(app, ctx);
  return [html, ctx];
};

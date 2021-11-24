import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { merge } from 'lodash-es';
// eslint-disable-next-line import/no-unresolved
import Card from '@/{cardName}/card.vue';

// Sentry
import * as Sentry from "@sentry/vue";
import { Integrations } from "@sentry/tracing";

const { contextData, i18nData } = window.__INITIAL_STATE__;

const { locale, defaultMessages, cardMessages } = i18nData;
const i18n = createI18n({
  locale,
  messages: {
    [locale]: merge({}, defaultMessages, cardMessages),
  },
});

const app = createApp({ ...Card, contextData });
app.config.unwrapInjectedRef = true; // TODO: remove when this is default in next vue release

// SENTRY
Sentry.init({
  app,
  dsn: "https://07dc842d53be467b8f158c93984a3fb9@o1076834.ingest.sentry.io/6080015",
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: [/.+\.lb\.djnd\.si/],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: "hrastnik",
});

app.use(i18n);
app.mount(`#${contextData.mountId}`);

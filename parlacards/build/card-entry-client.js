import { createApp } from 'vue';
import { createI18n } from 'vue-i18n';
import { merge } from 'lodash-es';
// Sentry
import * as Sentry from '@sentry/vue';
import { Integrations } from '@sentry/tracing';
// eslint-disable-next-line import/no-unresolved
import Card from '@/{cardName}/card.vue';

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
  dsn: 'https://07dc842d53be467b8f158c93984a3fb9@o1076834.ingest.sentry.io/6080015',
  integrations: [
    new Integrations.BrowserTracing({
      tracingOrigins: [/.+\.lb\.djnd\.si/, /.+\.parlameter\.si/],
    }),
  ],
  // Set tracesSampleRate to 1.0 to capture 100%
  // of transactions for performance monitoring.
  // We recommend adjusting this value in production
  tracesSampleRate: 1.0,
  environment: 'lendava',
  // Ignore some external errors, such as facebook,
  // twitter, slack bots or link crawlers and scanners.
  ignoreErrors: [
    // Outlook Safe Link scanning
    'Object Not Found Matching Id',
  ],
});

app.use(i18n);
app.mount(`#${contextData.mountId}`);

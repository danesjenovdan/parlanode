import { createSSRApp, ssrUtils } from 'vue';
import { createI18n } from 'vue-i18n';
import { renderToString } from '@vue/server-renderer';
import { merge } from 'lodash-es';
import * as Sentry from '@sentry/vue';
// eslint-disable-next-line import/no-unresolved
import Card from '@/{cardName}/card.vue';

export default async (contextData, i18nData) => {
  const { locale, defaultMessages, cardMessages } = i18nData;
  const i18n = createI18n({
    locale,
    messages: {
      [locale]: merge({}, defaultMessages, cardMessages),
    },
  });

  const app = createSSRApp({ ...Card, contextData });
  app.config.unwrapInjectedRef = true; // TODO: remove when this is default in next vue release
  app.use(i18n);

  // SENTRY
  Sentry.init({
    app,
    dsn: 'https://07dc842d53be467b8f158c93984a3fb9@o1076834.ingest.sentry.io/6080015',
    integrations: [new Sentry.BrowserTracing()],
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
      // Network errors
      'Network Error',
      'Request aborted',
    ],
    denyUrls: [
      // Chrome extensions
      /extensions\//i,
      /^chrome:\/\//i,
      /^chrome-extension:\/\//i,
    ],
  });

  try {
    const ctx = {};
    const html = await renderToString(app, ctx);
    return [html, ctx];
  } finally {
    //
    // THIS I A HACKY WORKAROUND: There is a bug in vue ssr renderer!
    //
    // NOTE (LepkoQQ): I tried to reproduce and report it, but I can't seem to
    // reproduce it in a simplified test case and they don't accept bug reports
    // without a minimal repro.
    //
    // If a component errors in data or a computed property that is immediately
    // accessed, the error is sometimes not caught, and cleanup code is not run.
    //
    // The next component that will want to resolve a component name will think
    // its running in the context that was left over from the errored component
    // and fail to resolve it.
    //
    // This should always be set to undefined after every render.
    //
    ssrUtils.setCurrentRenderingInstance(undefined);
  }
};

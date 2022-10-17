import 'make-promises-safe';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import { resolve } from 'path';
import { fastify as createFastify } from 'fastify';
import {
  getConfig,
  getSiteMap,
  fetchCard,
  getTranslations,
  getLocale,
} from './utils.js';
import registerRoutes from './routes/index.js';

const fastify = createFastify({ logger: true, ignoreTrailingSlash: true });

const config = getConfig();
const siteMap = getSiteMap();
const { defaultLocale } = config;
const defaultTranslations = getTranslations(defaultLocale);
const defaultFetchCard = (...args) => fetchCard(defaultLocale, ...args);

fastify.register(fastifyView, {
  engine: { ejs },
  options: { async: true },
  root: resolve('./views'),
});

fastify.addHook('preHandler', async (request, reply) => {
  const locale = getLocale(request.query.locale);

  /* eslint-disable no-param-reassign */
  reply.locals = {
    config,
    sm: siteMap,
    locale,
  };

  if (locale !== defaultLocale) {
    reply.locals.i18n = getTranslations(locale);
    reply.locals.fetchCard = (...args) => fetchCard(locale, ...args);
  } else {
    reply.locals.i18n = defaultTranslations;
    reply.locals.fetchCard = defaultFetchCard;
  }
  /* eslint-enable no-param-reassign */
});

fastify.setErrorHandler(async (error, request, reply) => {
  fastify.log.error(error);
  return reply.status(500).view('error/500', {
    pageTitle: '500 Internal Server Error',
    activeMenu: '',
    error,
  });
});

fastify.setNotFoundHandler(async (request, reply) => {
  return reply.status(404).view('error/404', {
    pageTitle: '404 Not Found',
    activeMenu: '',
  });
});

registerRoutes(fastify, siteMap);

fastify.listen(
  {
    port: process.env.PORT || 3066,
    host: '0.0.0.0',
  },
  (error) => {
    if (error) {
      fastify.log.error(error);
      process.exit(1);
    }
  }
);

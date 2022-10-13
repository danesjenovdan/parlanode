import 'make-promises-safe';
import { resolve } from 'path';
import { fastify as createFastify } from 'fastify';
import fastifyView from '@fastify/view';
import ejs from 'ejs';
import { getConfig, getSiteMap, fetchCard, getTranslations } from './utils.js';

const fastify = createFastify({ logger: true, ignoreTrailingSlash: true });

const { defaultLocale } = getConfig();
const defaultTranslations = getTranslations(defaultLocale);

fastify.register(fastifyView, {
  engine: { ejs },
  options: { async: true },
  root: resolve('./views'),
  defaultContext: {
    config: getConfig(),
    sm: getSiteMap(),
    locale: defaultLocale,
    i18n: defaultTranslations,
    fetchCard: (...args) => fetchCard(defaultLocale, ...args),
  },
});

fastify.addHook('preHandler', async (request, reply) => {
  if (request.query.locale !== defaultLocale) {
    // eslint-disable-next-line no-param-reassign
    reply.locals = {
      i18n: getTranslations(request.query.locale),
      fetchCard: (...args) => fetchCard(request.query.locale, ...args),
    };
  }
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

// fastify.get('/', async (request, reply) => {
//   return reply.view('landing/index.ejs', {}, { async: true });
// });

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

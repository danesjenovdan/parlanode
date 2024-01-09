import 'make-promises-safe';
import { resolve } from 'path';
import { fastify as createFastify } from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyCors from 'fastify-cors';
import * as Sentry from '@sentry/node';
import { renderCard } from './render-card.js';

Sentry.init({
  dsn: 'https://07dc842d53be467b8f158c93984a3fb9@o1076834.ingest.sentry.io/6080015',
  // We recommend adjusting this value in production, or using tracesSampler
  // for finer control
  tracesSampleRate: 1.0,
});

const fastify = createFastify({ logger: true, ignoreTrailingSlash: true });

fastify.register(fastifyCors, {
  origin: '*',
});

fastify.register(fastifyStatic, {
  root: resolve('./dist/client'),
  prefix: '/assets/',
});

const renderCardHandler = async (request, reply) => {
  const { group, method } = request.params;
  const { id, date, locale, template, ...state } = request.query;
  const cardName = `${group}/${method}`;
  let html;
  try {
    html = await renderCard({ cardName, id, date, locale, template, state });
    reply.type('text/html').send(html);
  } catch (error) {
    fastify.log.error(error);
    reply.status(500).type('text/html').send(error.stack);
  }
};

fastify.get('/:group/:method', renderCardHandler);

fastify.listen(process.env.PORT || 3000, '0.0.0.0', (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});

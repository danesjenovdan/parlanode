import createFastify from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySentry from '@immobiliarelabs/fastify-sentry';
import { HTTPError, renderCard } from './render-card.js';
import { getParlaHeaders } from './utils.js';

const fastify = createFastify({ logger: true, ignoreTrailingSlash: true });

fastify.register(fastifySentry, {
  dsn:
    process.env.NODE_ENV === 'production'
      ? 'https://07dc842d53be467b8f158c93984a3fb9@o1076834.ingest.sentry.io/6080015'
      : '',
});

process.on('unhandledRejection', (error) => {
  fastify.log.error(error);
  fastify.Sentry.captureException(error);
  fastify.Sentry.close().then(() => {
    process.exit(2);
  });
});

process.on('uncaughtException', (error) => {
  fastify.log.error(error);
  fastify.Sentry.captureException(error);
  fastify.Sentry.close().then(() => {
    process.exit(3);
  });
});

fastify.register(fastifyCors, {
  origin: '*',
});

const renderCardHandler = async (request, reply) => {
  const { group, method } = request.params;
  const { id, date, locale, template, ...state } = request.query;
  const cardName = `${group}/${method}`;
  const currentUrl = `${request.protocol}://${request.hostname}${request.originalUrl}`;
  const parlaHeaders = getParlaHeaders(request.headers);
  try {
    const html = await renderCard({
      cardName,
      id,
      date,
      locale,
      template,
      state,
      currentUrl,
      parlaHeaders,
    });
    return reply.type('text/html').send(html);
  } catch (error) {
    if (error instanceof HTTPError) {
      if (error.statusCode < 500) {
        return reply
          .status(error.statusCode)
          .type('text/html')
          .send(error.message);
      }
    }
    fastify.log.error(error);
    fastify.Sentry.captureException(error);
    return reply.status(500).type('text/html').send(error.stack);
  }
};

fastify.get('/:group/:method', renderCardHandler);

fastify.listen({ port: process.env.PORT || 3000, host: '0.0.0.0' }, (error) => {
  if (error) {
    fastify.log.error(error);
    fastify.Sentry.captureException(error);
    fastify.Sentry.close().then(() => {
      process.exit(1);
    });
  }
});

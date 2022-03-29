import 'make-promises-safe';
import './load-env.js';
import { resolve } from 'path';
import { fastify as createFastify } from 'fastify';
import fastifyStatic from 'fastify-static';
import fastifyCors from 'fastify-cors';
import { renderCard } from './render-card.js';

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

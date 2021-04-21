import 'make-promises-safe';
import './load-env.js';
import { resolve } from 'path';
import { fastify as createFastify } from 'fastify';
import fastifyStatic from 'fastify-static';
import { renderCard } from './render-card.js';

const fastify = createFastify({ logger: true });

fastify.register(fastifyStatic, {
  root: resolve('./dist/client'),
  prefix: '/assets/',
});

const renderCardHandler = async (request, reply) => {
  const { group, method, id } = request.params;
  const { locale, state } = request.query;
  const cardName = `${group}/${method}`;
  const [error, html] = await renderCard({ cardName, id, locale, state });
  if (!error) {
    reply.type('text/html').send(html);
  } else {
    fastify.log.error(error);
    reply.status(error.statusCode ?? 500).send(error);
  }
};

fastify.get('/:group/:method', renderCardHandler);
fastify.get('/:group/:method/:id', renderCardHandler);

fastify.listen(process.env.PORT || 3000, '0.0.0.0', (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});

import 'make-promises-safe';
import { resolve } from 'path';
import { fastify as createFastify } from 'fastify';
import fastifyStatic from 'fastify-static';
import { renderCard } from './render-card.js';

const fastify = createFastify({ logger: true });

fastify.register(fastifyStatic, {
  root: resolve('./dist/client'),
  prefix: '/assets/',
});

fastify.get('/:group/:method', async (request, reply) => {
  const { group, method } = request.params;
  const { locale } = request.query;
  const cardName = `${group}/${method}`;
  const [error, html] = await renderCard(cardName, locale);
  if (!error) {
    reply.type('text/html').send(html);
  } else {
    fastify.log.error(error);
    reply.status(error.statusCode ?? 500).send(error);
  }
});

fastify.listen(3000, (error) => {
  if (error) {
    fastify.log.error(error);
    process.exit(1);
  }
});

import { fastify } from 'fastify';
import { cardRoutes } from './routes/cards.js';

const server = fastify({ logger: true });

server.get('/', () => ({ ok: true }));
server.get('/hello', () => ({ ok: true }));

server.register(cardRoutes, { prefix: '/cards' });

(async () => {
  try {
    await server.listen(3000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();

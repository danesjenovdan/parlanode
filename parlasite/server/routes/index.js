import landing from './landing.js';
import legislation from './legislation.js';
import sessions from './sessions.js';

export default function registerRoutes(fastify, siteMap) {
  const sm = siteMap;
  fastify.register(landing, { prefix: '/', sm });
  fastify.register(legislation, { prefix: `/${sm.landing.legislation}`, sm });
  fastify.register(sessions, { prefix: `/${sm.landing.sessions}`, sm });
}

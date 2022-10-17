// router.get('/', ar((render) => {
//   render('seje', {
//     ogImageUrl: getOgImageUrl('generic', { title: i18n('titles.session-list') }),
//     activeMenu: 'sessions',
//     pageTitle: i18n('titles.session-list'),
//   });
// }));

// router.get(`/${sm.sessions.search.base}`, ar((render, req) => {
//   render('seje/isci', {
//     activeMenu: 'sessions_search',
//     pageTitle: i18n('titles.sessions-search'),
//     query: req.query.q,
//     mps: req.query.mps,
//     pgs: req.query.pgs,
//   });
// }));

import { fetchPageData, getOgImageUrl } from '../utils.js';

export default function registerRoutes(fastify, opts, done) {
  // async function fetchData(slug) {
  //   return fetchPageData('legislation/single', slug);
  // }

  // fastify.get('/', async (request, reply) => {
  //   return reply.view('legislation/index', {
  //     ogImageUrl: getOgImageUrl('generic', {
  //       title: reply.locals.i18n('menu.legislation'),
  //     }),
  //     activeMenu: 'legislation',
  //     pageTitle: reply.locals.i18n('menu.legislation'),
  //   });
  // });

  // fastify.get('/:slug([a-z0-9-]+)', async (request, reply) => {
  //   const lawData = await fetchData(request.params.slug);
  //   if (lawData) {
  //     return reply.view('legislation/single', {
  //       ogImageUrl: getOgImageUrl('circle', {
  //         title: reply.locals.i18n('titles.legislation'),
  //         h1: lawData.results.text,
  //       }),
  //       activeMenu: 'legislation_act',
  //       pageTitle: reply.locals.i18n('titles.legislation'),
  //       lawData,
  //     });
  //   }
  //   return reply.callNotFound();
  // });

  done();
}

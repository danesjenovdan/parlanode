// // get /seje -> routes/seje.js

// router.get(
//   `/${sm.landing.members}`,
//   ar((render) => {
//     render('landing/poslanci', {
//       ogImageUrl: getOgImageUrl('generic', { title: i18n('menu.mps') }),
//       activeMenu: 'mps',
//       pageTitle: i18n('menu.mps'),
//     });
//   })
// );

// router.get(
//   `/${sm.landing.parties}`,
//   ar((render) => {
//     render('landing/poslanske-skupine', {
//       ogImageUrl: getOgImageUrl('generic', { title: i18n('menu.pgs') }),
//       activeMenu: 'pgs',
//       pageTitle: i18n('menu.pgs'),
//     });
//   })
// );

// // get /orodja -> routes/orodja.js

export default function registerRoutes(fastify, { sm }, done) {
  fastify.get('/', async (request, reply) => {
    return reply.view('landing/index', {
      activeMenu: 'landing',
      pageTitle: reply.locals.i18n('landing.title'),
      query: request.query.q,
    });
  });

  fastify.get(`/${sm.landing.legal}`, async (request, reply) => {
    return reply.view('landing/legal', {
      activeMenu: 'landing',
      pageTitle: reply.locals.i18n('legal.title'),
    });
  });

  done();
}

import { i18n } from '../server.js';
import landingRouter from './landing.js';

export function setupRoutes(app) {
  const sm = i18n.siteMap;

  app.use('/', landingRouter);

  // app.use(`/${sm.landing.legislation}`, require('./zakonodaja'));
  // app.use(`/${sm.landing.sessions}`, require('./seje'));
  // app.use(`/${sm.landing.tools}`, require('./orodja'));
  // app.use(`/${sm.member.leaderBase}`, require('./poslanec').leader);
  // app.use(`/${sm.member.base}`, require('./poslanec').poslanec);
  // app.use(`/${sm.party.base}`, require('./poslanska-skupina'));
  // app.use(`/${sm.session.base}`, require('./seja'));

  // app.use('/api', require('./api'));
}

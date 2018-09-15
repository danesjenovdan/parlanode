const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');
const { i18n } = require('../server');

const router = express.Router();

router.get('/', ar((render) => {
  render('orodja', {
    activeMenu: 'tools',
    pageTitle: i18n('menu.tools'),
  });
}));

router.get(`/${sm.tools.notifications}`, ar((render) => {
  render('orodja/obvestila', {
    activeMenu: 'tools',
    pageTitle: i18n('tools.notifications.title'),
    currentTool: 'obvestila',
  });
}));

router.get(`/${sm.tools.voteComparator}`, ar((render) => {
  render('orodja/primerjalnik-glasovanj', {
    activeMenu: 'tools',
    pageTitle: i18n('tools.voteComparator.title'),
    currentTool: 'primerjalnik-glasovanj',
  });
}));

router.get(`/${sm.tools.discord}`, ar((render) => {
  render('orodja/raziskovalec-neenotnosti', {
    activeMenu: 'tools',
    pageTitle: i18n('tools.discord.title'),
    currentTool: 'raziskovalec-neenotnosti',
  });
}));

router.get(`/${sm.tools.compass}`, ar((render) => {
  render('orodja/parlamentarni-kompas', {
    activeMenu: 'tools',
    pageTitle: i18n('tools.compass.title'),
    currentTool: 'parlamentarni-kompas',
  });
}));

router.get(`/${sm.tools.wordGroups}`, ar((render) => {
  render('orodja/skupine-besed', {
    activeMenu: 'tools',
    pageTitle: i18n('tools.wordGroups.title'),
    currentTool: 'skupine-besed',
  });
}));

module.exports = router;

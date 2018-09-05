const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');

const router = express.Router();

router.get('/', ar((render) => {
  render('orodja', {
    activeMenu: 'tools',
    pageTitle: 'Orodja',
  });
}));

router.get(`/${sm.tools.voteComparator}`, ar((render) => {
  render('orodja/primerjalnik-glasovanj', {
    activeMenu: 'tools',
    pageTitle: 'Primerjalnik glasovanj',
    currentTool: 'primerjalnik-glasovanj',
  });
}));

router.get(`/${sm.tools.discord}`, ar((render) => {
  render('orodja/raziskovalec-neenotnosti', {
    activeMenu: 'tools',
    pageTitle: 'Raziskovalec neenotnosti',
    currentTool: 'raziskovalec-neenotnosti',
  });
}));

router.get(`/${sm.tools.compass}`, ar((render) => {
  render('orodja/parlamentarni-kompas', {
    activeMenu: 'tools',
    pageTitle: 'Parlamentarni kompas',
    currentTool: 'parlamentarni-kompas',
  });
}));

router.get(`/${sm.tools.wordGroups}`, ar((render) => {
  render('orodja/skupine-besed', {
    activeMenu: 'tools',
    pageTitle: 'Skupine besed',
    currentTool: 'skupine-besed',
  });
}));

module.exports = router;

const express = require('express');
const { asyncRender: ar } = require('../utils');
const { siteMap: sm } = require('../../config');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('orodja', {
    activeMenu: 'orodja',
    pageTitle: 'Orodja',
  });
});

router.get(`/${sm.tools.voteComparator}`, ar((render) => {
  render('orodja/primerjalnik-glasovanj', {
    activeMenu: 'orodja',
    pageTitle: 'Primerjalnik glasovanj',
    currentTool: 'primerjalnik-glasovanj',
  });
}));

router.get(`/${sm.tools.discord}`, ar((render) => {
  render('orodja/raziskovalec-neenotnosti', {
    activeMenu: 'orodja',
    pageTitle: 'Raziskovalec neenotnosti',
    currentTool: 'raziskovalec-neenotnosti',
  });
}));

router.get(`/${sm.tools.compass}`, ar((render) => {
  render('orodja/parlamentarni-kompas', {
    activeMenu: 'orodja',
    pageTitle: 'Parlamentarni kompas',
    currentTool: 'parlamentarni-kompas',
  });
}));

router.get(`/${sm.tools.wordGroups}`, ar((render) => {
  render('orodja/skupine-besed', {
    activeMenu: 'orodja',
    pageTitle: 'Skupine besed',
    currentTool: 'skupine-besed',
  });
}));

module.exports = router;

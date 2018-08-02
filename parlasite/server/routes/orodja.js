const express = require('express');
const { asyncRender: ar } = require('../utils');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('orodja', {
    activeMenu: 'orodja',
    pageTitle: 'Orodja',
  });
});

router.get('/primerjalnik-glasovanj', ar((render) => {
  render('orodja/primerjalnik-glasovanj', {
    activeMenu: 'orodja',
    pageTitle: 'Primerjalnik glasovanj',
    currentTool: 'primerjalnik-glasovanj',
  });
}));

router.get('/raziskovalec-neenotnosti', ar((render) => {
  render('orodja/raziskovalec-neenotnosti', {
    activeMenu: 'orodja',
    pageTitle: 'Raziskovalec neenotnosti',
    currentTool: 'raziskovalec-neenotnosti',
  });
}));

router.get('/parlamentarni-kompas', ar((render) => {
  render('orodja/parlamentarni-kompas', {
    activeMenu: 'orodja',
    pageTitle: 'Parlamentarni kompas',
    currentTool: 'parlamentarni-kompas',
  });
}));

router.get('/skupine-besed', ar((render) => {
  render('orodja/skupine-besed', {
    activeMenu: 'orodja',
    pageTitle: 'Skupine besed',
    currentTool: 'skupine-besed',
  });
}));

module.exports = router;

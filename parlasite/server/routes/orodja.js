const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
  res.render('orodja', {
    activeMenu: 'orodja',
    pageTitle: 'Orodja',
  });
});

router.get('/primerjalnik-glasovanj', (req, res) => {
  res.render('orodja/primerjalnik-glasovanj', {
    activeMenu: 'orodja',
    pageTitle: 'Primerjalnik glasovanj',
    currentTool: 'primerjalnik-glasovanj',
  });
});

router.get('/raziskovalec-neenotnosti', (req, res) => {
  res.render('orodja/raziskovalec-neenotnosti', {
    activeMenu: 'orodja',
    pageTitle: 'Raziskovalec neenotnosti',
    currentTool: 'raziskovalec-neenotnosti',
  });
});

router.get('/parlamentarni-kompas', (req, res) => {
  res.render('orodja/parlamentarni-kompas', {
    activeMenu: 'orodja',
    pageTitle: 'Parlamentarni kompas',
    currentTool: 'parlamentarni-kompas',
  });
});

router.get('/skupine-besed', (req, res) => {
  res.render('orodja/skupine-besed', {
    activeMenu: 'orodja',
    pageTitle: 'Skupine besed',
    currentTool: 'skupine-besed',
  });
});

module.exports = router;

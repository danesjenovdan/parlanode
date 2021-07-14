const express = require('express');
const data = require('../data');
const { asyncRender: ar } = require('../utils');
const { i18n } = require('../server');
const fetch = require('node-fetch');

const router = express.Router();

async function getNewData(slug) {
  const id = parseInt(slug.split('-')[0]);
  // TODO this shouldn't be hard-coded
  const response = await fetch(`https://parladata.lb.djnd.si/v3/cards/legislation/single?id=${id}`);
  if (response.ok && response.status >= 200 && response.status < 400) {
    let data = await response.json();
    return {
      ...data,
    };
  }
  return false;
}

router.get('/', ar((render) => {
  render('zakonodaja', {
    activeMenu: 'legislation',
    pageTitle: i18n('menu.legislation'),
  });
}));

router.get('/:slug([a-z0-9-]+)', ar((render, req, res, next) => {
  getNewData(req.params.slug).then((lawData) => {
    if (lawData) {
      render('zakonodaja/zakon', {
        activeMenu: 'legislation_act',
        pageTitle: i18n('titles.legislation'),
        lawData,
      });
    } else {
      next();
    }
  });
}));

module.exports = router;

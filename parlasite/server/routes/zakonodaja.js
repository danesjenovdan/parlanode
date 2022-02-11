const express = require('express');
const fetch = require('node-fetch');
const { asyncRender: ar, getOgImageUrl } = require('../utils');
const { urls } = require('../../config');
const { i18n } = require('../server');

const router = express.Router();

async function getNewData(slug) {
  const id = parseInt(slug.split('-')[0], 10);
  // TODO this shouldn't be hard-coded
  const response = await fetch(`https://parladata.lb.djnd.si/v3/cards/legislation/single?id=${id}`);
  // response.ok means status is 2xx
  if (response.ok) {
    const data = await response.json();
    return {
      ...data,
    };
  }
  return false;
}

router.get('/', ar((render) => {
  render('zakonodaja', {
    ogImageUrl: getOgImageUrl('generic', { title: i18n('menu.legislation') }),
    activeMenu: 'legislation',
    pageTitle: i18n('menu.legislation'),
  });
}));

router.get('/:slug([a-z0-9-]+)', ar(async (render, req, res, next) => {
  const lawData = await getNewData(req.params.slug);
  if (lawData) {
    render('zakonodaja/zakon', {
      ogImageUrl: getOgImageUrl('circle', {
        title: i18n('titles.legislation'),
        h1: lawData.results.text,
      }),
      activeMenu: 'legislation_act',
      pageTitle: i18n('titles.legislation'),
      lawData,
    });
  } else {
    next();
  }
}));

module.exports = router;

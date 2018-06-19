/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs-extra');
const ejs = require('ejs');
const cheerio = require('cheerio');
const util = require('util');
const webshot = util.promisify(require('webshot'));
global.Vue = require('vue'); // TODO: do we need this to be global
const renderer = require('vue-server-renderer');
// const exec = util.promisify(require('child_process').exec);
const { performance } = require('perf_hooks');
const config = require('../../../config');

exports.deleteAll = (req, res) => {
  const CardRender = mongoose.model('CardRender');

  CardRender.remove({})
    .then(() => {
      res.send('Done');
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

exports.getUrls = (req, res) => {
  const CardRender = mongoose.model('CardRender');

  CardRender.find({}).lean()
    .then((cardDocs) => {
      const cards = cardDocs.map((cardDoc) => {
        cardDoc.html = `HTML length: ${cardDoc.html.length}`;
        return cardDoc;
      });

      res.send({
        count: cards.length,
        cards,
      });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

exports.getCardById = (req, res) => {
  const { cardId } = req.params;
  const CardRender = mongoose.model('CardRender');

  CardRender.findOne({ _id: cardId }).lean()
    .then((cardDoc) => {
      if (!cardDoc) {
        res.status(404).send();
      } else {
        res.send(cardDoc.html);
      }
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

async function loadCardJSON(cacheData) {
  const cardJSON = await fs.readJson(`cards/${cacheData.group}/${cacheData.method}/card.json`);
  cardJSON.lastUpdate = new Date(cardJSON.lastUpdate);
  return cardJSON;
}

async function fetchData(dataUrl) {
  let dataRes;
  try {
    dataRes = await axios.get(dataUrl);
  } catch (err) {
    throw new Error(`${err.message} (${dataUrl})`);
  }
  if (typeof dataRes.data !== 'object') {
    throw new Error(`Request did not return JSON (${dataUrl})`);
  }
  return dataRes.data;
}

async function loadBundles(cacheData) {
  const bundlesPath = `cards/${cacheData.group}/${cacheData.method}/bundles`;
  return Promise.all([
    fs.readFile(`${bundlesPath}/server.js`, 'utf-8'),
    fs.readFile(`${bundlesPath}/client.js`, 'utf-8'),
    fs.readFile(`${bundlesPath}/style.css`, 'utf-8'),
  ]);
}

// async function buildCard(cacheData) {
//   try {
//     // TODO: lang
//     await exec(`node cards/build-cross-env ${cacheData.group}/${cacheData.method} build sl`);
//   } catch (error) {
//     // eslint-disable-next-line no-console
//     console.log(error.stdout);
//     // eslint-disable-next-line no-console
//     console.error(error.stderr);
//     throw error;
//   }
// }

async function addOgImage(cardJSON, cardRender, context) {
  const ogEjs = await fs.readFile(`views/og/${cardJSON.type}.ejs`, 'utf-8');
  const ogHtml = ejs.render(ogEjs, context);

  await webshot(ogHtml, `${config.ogCapturePath}/${cardRender._id}.jpeg`, {
    siteType: 'html',
    captureSelector: '#og-container',
    quality: 80,
  });

  cardRender.ogImageUrl = `${config.ogRootUrl}/${cardRender._id}.jpeg`;

  const $ = cheerio.load(cardRender.html, { decodeEntities: false });
  $('head').append(`<meta property="og:image" content="${cardRender.ogImageUrl}" />`);
  $('head').append(`<meta name="twitter:image" content="${cardRender.ogImageUrl}" />`);

  cardRender.html = $.html();
}

async function renderCard(cacheData, cardJSON, originalUrl) {
  cacheData.dataUrl = cardJSON.dataUrl; // TODO add full url with domain from config
  cacheData.card = cardJSON._id;
  cacheData.cardUrl = originalUrl;
  cacheData.cardLastUpdate = cardJSON.lastUpdate;

  let fetchUrl;
  if (cacheData.customUrl) {
    fetchUrl = decodeURI(cacheData.customUrl);
  } else {
    // TODO: get domain for url from config and remove domain from each card url
    fetchUrl = `${cacheData.dataUrl}${cacheData.id ? `/${cacheData.id}` : ''}${cacheData.date ? `/${cacheData.date}` : ''}`;
  }
  const data = await fetchData(fetchUrl);

  const [serverBundle, clientBundle, styleBundle] = await loadBundles(cacheData);

  let vueTemplateName = 'default';
  if (cacheData.frame) {
    vueTemplateName = 'frame';
  } else if (cacheData.embed) {
    vueTemplateName = 'embed';
  }

  const template = await fs.readFile(`cards/template_${vueTemplateName}.html`, 'utf-8');
  const rendererInstance = renderer.createBundleRenderer(serverBundle, {
    template,
    runInNewContext: false,
  });

  const parsedState = JSON.parse(cacheData.state);
  const context = {
    data,
    cardData: cardJSON,
    customUrl: fetchUrl,
    state: parsedState,
    parlaState: parsedState,
    clientBundle,
    styleBundle,
  };

  const html = await rendererInstance.renderToString(context);
  cacheData.html = html;

  const CardRender = mongoose.model('CardRender');

  await CardRender.remove({
    group: cacheData.group,
    method: cacheData.method,
    id: cacheData.id,
    date: cacheData.date,
    embed: cacheData.embed,
    frame: cacheData.frame,
    altHeader: cacheData.altHeader,
    customUrl: cacheData.customUrl,
    state: cacheData.state,
  });

  const cardRender = new CardRender(cacheData);

  if (cardJSON.type && cardJSON.type !== 'iskanje' && (cacheData.frame || cacheData.embed)) {
    await addOgImage(cardJSON, cardRender, context);
  }

  return cardRender.save();
}

async function getRenderedCard(cacheData, forceRender, originalUrl) {
  const cardJSON = await loadCardJSON(cacheData);
  let renderedCard = null;
  if (!forceRender) {
    // eslint-disable-next-line no-console
    console.log(`Card: ${cacheData.group}/${cacheData.method} - TRYING CACHE`);
    const CardRender = mongoose.model('CardRender');
    renderedCard = await CardRender.findOne(cacheData).lean().sort({ dateTime: -1 });
  }
  if (!renderedCard || Number(cardJSON.lastUpdate) !== Number(renderedCard.cardLastUpdate)) {
    // eslint-disable-next-line no-console
    console.log(`Card: ${cacheData.group}/${cacheData.method} - NOT CACHED`);
    // TODO this changes the date in card.json which means it recompiles every time
    // await buildCard(cacheData);
    // cardJSON = await loadCardJSON(cacheData);
    renderedCard = await renderCard(cacheData, cardJSON, originalUrl);
  }
  return renderedCard;
}

function dateToday() {
  const date = new Date();
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
}

const IS_VALID_CUSTOM_URL = /^https?:\/\/[^/]*\.parlameter\.si\//;

exports.render = (req, res) => {
  const { group, method } = req.params;
  const id = req.params.id || null;
  const date = req.params.date || dateToday();
  const embed = !!req.query.embed;
  const frame = !!req.query.frame;
  const altHeader = !!req.query.altHeader;
  const customUrl = req.query.customUrl || null;
  const state = req.query.state || '{}';

  const forceRender = !!req.query.forceRender;

  if (customUrl && !IS_VALID_CUSTOM_URL.test(customUrl)) {
    res.status(400).send({ error: 'Invalid custom url' });
    return;
  }

  const cacheData = {
    group,
    method,
    id,
    date,
    embed,
    frame,
    altHeader,
    customUrl,
    state,
  };

  const startTime = performance.now();
  // eslint-disable-next-line no-console
  console.log(`Card: ${group}/${method} - START`);

  getRenderedCard(cacheData, forceRender, req.originalUrl)
    .then((renderedCard) => {
      // eslint-disable-next-line no-console
      console.log(`Card: ${group}/${method} - END after ${Math.round(performance.now() - startTime)} ms`);
      if (renderedCard && renderedCard.html) {
        res.send(renderedCard.html);
      } else {
        res.status(500).send({ error: 'No rendered card' });
      }
    })
    .catch((error) => {
      // eslint-disable-next-line no-console
      console.error(error);
      res.status(500).send({ error: error.message });
    })
    .catch(() => {
      res.status(500).send({ error: 'Internal Server Error' });
    });
};

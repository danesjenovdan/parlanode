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
const { directive: t } = require('vue-i18n-extensions');
const exec = util.promisify(require('child_process').exec);
const { performance } = require('perf_hooks');
const dateFns = require('date-fns');
const _ = require('lodash');
const config = require('../../../config');
const urlSlugs = require('../../../assets/urls.json');

function getModelObjects(modelName, res, mapFunc) {
  const Model = mongoose.model(modelName);
  Model.find({}).lean()
    .then((docs) => {
      res.send({
        count: docs.length,
        docs: mapFunc ? docs.map(mapFunc) : docs,
      });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

exports.getRenders = (req, res) => {
  getModelObjects('CardRender', res, (doc) => {
    doc.html = `HTML length: ${doc.html.length}`;
    return doc;
  });
};

exports.getBuilds = (req, res) => {
  getModelObjects('CardBuild', res);
};

function clearModel(modelName, res) {
  const Model = mongoose.model(modelName);
  Model.remove({})
    .then((obj) => {
      res.send(obj);
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

exports.deleteRenders = (req, res) => {
  clearModel('CardRender', res);
};

exports.deleteBuilds = (req, res) => {
  clearModel('CardBuild', res);
};

exports.deleteBuildId = (req, res) => {
  const CardBuild = mongoose.model('CardBuild');
  CardBuild.findByIdAndRemove(req.params.id)
    .then((obj) => {
      res.send({ deleted: !!obj });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
};

exports.cleanUp = (req, res) => {
  const cutoff = dateFns.addDays(new Date(), -28);
  const CardRender = mongoose.model('CardRender');
  CardRender.remove({ lastAccessed: { $lt: cutoff } })
    .then(() => CardRender.find({}).distinct('_id'))
    .then((docs) => {
      const existing = docs.map(f => `${f}.jpeg`);
      return fs.readdir(config.ogCapturePath)
        .then((files) => {
          _.pullAll(files, existing);
          return files.reduce(
            (p, f) => p.then(() => fs.remove(`${config.ogCapturePath}/${f}`)),
            Promise.resolve(),
          );
        })
        .then(() => {
          if (res) {
            res.send({ ok: true });
          }
        });
    })
    .catch((err) => {
      if (res) {
        res.status(400).send(err);
      }
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

function expandUrl(dataUrl) {
  Object.keys(config.urls).forEach((key) => {
    dataUrl = dataUrl.replace(`{${key}}`, config.urls[key]);
  });
  return dataUrl;
}

async function shouldBuildCard(cacheData, cardJSON) {
  try {
    const CardBuild = mongoose.model('CardBuild');
    const cardBuild = await CardBuild.findOne({ group: cacheData.group, method: cacheData.method });
    if (!cardBuild) {
      return true;
    }
    if (urlSlugs.__lastUpdate && urlSlugs.__lastUpdate > Number(cardBuild.lastBuilt)) {
      return true;
    }
    if (Number(cardBuild.lastBuilt) !== Number(cardJSON.lastUpdate)) {
      return true;
    }
    if (cardBuild.language !== config.cardLang) {
      return true;
    }
    if (expandUrl(cardBuild.dataUrl) !== expandUrl(cardJSON.dataUrl)) {
      return true;
    }
    return false;
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return true;
  }
}

// Store build commands cards that are currently building so we don't build
// the same card twice at the same time
const ongoingCardBuilds = new Map();

async function buildCard(cacheData, cardJSON) {
  const buildCommand = `node cards/build-cross-env ${cacheData.group}/${cacheData.method} build ${config.cardLang} --update-timestamp=false`;
  try {
    let promise;
    if (ongoingCardBuilds.has(buildCommand)) {
      promise = ongoingCardBuilds.get(buildCommand);
    } else {
      promise = exec(buildCommand);
      ongoingCardBuilds.set(buildCommand, promise);
    }
    await promise;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.log(error.stdout);
    // eslint-disable-next-line no-console
    console.error(error.stderr);
    throw error;
  } finally {
    ongoingCardBuilds.delete(buildCommand);
  }
  cardJSON = await loadCardJSON(cacheData);
  const CardBuild = mongoose.model('CardBuild');
  await CardBuild.findOneAndUpdate(
    { group: cacheData.group, method: cacheData.method },
    {
      lastBuilt: cardJSON.lastUpdate.toJSON(),
      language: config.cardLang,
      dataUrl: cardJSON.dataUrl,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return cardJSON;
}

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
  cacheData.dataUrl = cardJSON.dataUrl;
  cacheData.card = cardJSON._id;
  cacheData.cardUrl = `${config.cardRootUrl}${originalUrl}`;
  cacheData.cardLastUpdate = cardJSON.lastUpdate;

  let fetchUrl;
  if (cacheData.customUrl) {
    fetchUrl = decodeURI(cacheData.customUrl);
  } else {
    fetchUrl = `${expandUrl(cacheData.dataUrl)}${cacheData.id ? `/${cacheData.id}` : ''}${cacheData.date ? `/${cacheData.date}` : ''}`;
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
    directives: { t },
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
  context.cardData.altHeader = JSON.stringify(cacheData.altHeader);

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

  cardRender.lastAccessed = new Date();
  return cardRender.save();
}

function formattedDate(days = 0) {
  return dateFns.format(dateFns.addDays(new Date(), days), 'D.M.YYYY');
}

async function getRenderedCard(cacheData, forceRender, originalUrl) {
  let cardJSON = await loadCardJSON(cacheData);
  let renderedCard = null;
  if (!forceRender) {
    // eslint-disable-next-line no-console
    console.log(`Card: ${cacheData.group}/${cacheData.method} - TRYING CACHE`);
    const CardRender = mongoose.model('CardRender');
    renderedCard = await CardRender.findOne(cacheData).sort({ dateTime: -1 });
    if (renderedCard) {
      renderedCard.lastAccessed = new Date();
      renderedCard.save();
    } else {
      const cacheDataYesterday = { ...cacheData, date: formattedDate(-1) };
      renderedCard = await CardRender.findOne(cacheDataYesterday).sort({ dateTime: -1 });
      if (renderedCard) {
        // render today's cache but don't await it
        renderCard(cacheData, cardJSON, originalUrl);
        // eslint-disable-next-line no-console
        console.log(`Card: ${cacheData.group}/${cacheData.method} - RETURN YESTERDAY'S CACHE AND RENDER NEW`);
        return renderedCard;
      }
    }
  }
  if (!renderedCard || Number(cardJSON.lastUpdate) !== Number(renderedCard.cardLastUpdate)) {
    // eslint-disable-next-line no-console
    console.log(`Card: ${cacheData.group}/${cacheData.method} - NOT CACHED (forceRender=${forceRender})`);
    if (await shouldBuildCard(cacheData, cardJSON)) {
      // eslint-disable-next-line no-console
      console.log(`Card: ${cacheData.group}/${cacheData.method} - BUILDING`);
      cardJSON = await buildCard(cacheData, cardJSON);
    }
    renderedCard = await renderCard(cacheData, cardJSON, originalUrl);
  }
  return renderedCard;
}

const IS_VALID_CUSTOM_URL = /^https?:\/\/[^/]*\.parlameter\.si\//;

exports.render = (req, res) => {
  const { group, method } = req.params;
  const id = req.params.id || null;
  const date = req.params.date || formattedDate();
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

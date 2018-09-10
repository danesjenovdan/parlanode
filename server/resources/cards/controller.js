/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const axios = require('axios');
const fs = require('fs-extra');
const util = require('util');
const renderer = require('vue-server-renderer');
const { directive: t } = require('vue-i18n-extensions');
const exec = util.promisify(require('child_process').exec);
// TODO: remove this comment when vscode is fixed
// eslint-disable-next-line import/no-unresolved
const { performance } = require('perf_hooks');
const dateFns = require('date-fns');
const _ = require('lodash');
const config = require('../../../config');
const data = require('../../data');

const CardBuild = mongoose.model('CardBuild');
const CardRender = mongoose.model('CardRender');

async function loadCardJson(cacheData) {
  const cardJson = await fs.readJson(`cards/${cacheData.group}/${cacheData.method}/card.json`);
  cardJson.lastUpdate = new Date(cardJson.lastUpdate);
  return cardJson;
}

async function fetchData(dataUrl, cacheData) {
  let dataRes;
  try {
    dataRes = await axios.get(dataUrl, {
      headers: {
        'X-Parlameter-Card-Path': `${cacheData.group}/${cacheData.method}`,
        'X-Parlameter-Card-ID': cacheData.id != null ? cacheData.id : '',
        'X-Parlameter-Card-Url': cacheData.cardUrl,
      },
    });
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

async function loadI18n(cacheData) {
  const i18nDefaultsPath = `cards/_i18n/${config.cardLang}/defaults.json`;
  const i18nCardPath = `cards/_i18n/${config.cardLang}/${cacheData.group}/${cacheData.method}.json`;
  const [i18nDefault, i18nCard] = await Promise.all([
    fs.readJson(i18nDefaultsPath),
    fs.readJson(i18nCardPath),
  ]);
  return _.merge({}, i18nDefault, i18nCard);
}

async function saveBuildEntry(cacheData, cardJson) {
  await CardBuild.findOneAndUpdate(
    { group: cacheData.group, method: cacheData.method },
    {
      lastBuilt: cardJson.lastUpdate,
      language: config.cardLang,
      dataUrl: cardJson.dataUrl,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

async function getBundlesModifiedTime(cacheData) {
  try {
    const bundlesPath = `cards/${cacheData.group}/${cacheData.method}/bundles`;
    const stats = await Promise.all([
      fs.stat(`${bundlesPath}/server.js`),
      fs.stat(`${bundlesPath}/client.js`),
      fs.stat(`${bundlesPath}/style.css`),
    ]);
    return Math.min(...stats.map(s => s.mtimeMs));
  } catch (error) {
    if (error.code !== 'ENOENT') {
      throw error;
    }
    return 0;
  }
}

function expandUrl(dataUrl) {
  if (typeof dataUrl === 'string') {
    Object.keys(data.urls.urls).forEach((key) => {
      dataUrl = dataUrl.replace(`{${key}}`, data.urls.urls[key]);
    });
    return dataUrl;
  }
  return null;
}

async function shouldBuildCard(cacheData, cardJson) {
  const cardBuild = await CardBuild.findOne({ group: cacheData.group, method: cacheData.method });
  if (!cardBuild) {
    if (await getBundlesModifiedTime(cacheData) > 0) {
      // if there is no build entry in db but files exist just add the entry
      await saveBuildEntry(cacheData, cardJson);
      return false;
    }
    return true;
  }
  if (Number(cardBuild.lastBuilt) !== Number(cardJson.lastUpdate)) {
    if (process.env.NODE_ENV !== 'production') {
      // in development environments, if there is a newer card json update
      // time and files were modified around that time just update the entry
      const filesModifiedTime = await getBundlesModifiedTime(cacheData);
      const areTimesClose = Math.abs(Number(cardJson.lastUpdate) - filesModifiedTime) < 5000;
      if (areTimesClose) {
        await saveBuildEntry(cacheData, cardJson);
        return false;
      }
    }
    return true;
  }
  if (cardBuild.language !== config.cardLang) {
    return true;
  }
  if (expandUrl(cardBuild.dataUrl) !== expandUrl(cardJson.dataUrl)) {
    return true;
  }
  return false;
}

// Store build commands cards that are currently building so we don't build
// the same card twice at the same time
const ongoingCardBuilds = new Map();

async function buildCard(cacheData, cardJson) {
  const buildCommand = `node cards/build-cross-env.js ${cacheData.group}/${cacheData.method} build ${config.cardLang} --update-timestamp=false`;
  try {
    let promise;
    if (ongoingCardBuilds.has(buildCommand)) {
      promise = ongoingCardBuilds.get(buildCommand);
    } else {
      promise = exec(buildCommand, { timeout: 60000 });
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
  await saveBuildEntry(cacheData, cardJson);
}

async function renderCard(cacheData, cardJson, originalUrl) {
  cacheData.card = cardJson._id;
  cacheData.dataUrl = cardJson.dataUrl ? expandUrl(cardJson.dataUrl) : null;
  cacheData.customUrl = cardJson.dataUrl ? expandUrl(cacheData.customUrl) : null;
  cacheData.cardUrl = `${data.urls.urls.glej}${originalUrl}`;
  cacheData.cardLastUpdate = cardJson.lastUpdate;

  let fetchUrl = null;
  if (cacheData.customUrl) {
    fetchUrl = cacheData.customUrl;
  } else if (cacheData.dataUrl) {
    fetchUrl = `${cacheData.dataUrl}${cacheData.id ? `/${cacheData.id}` : ''}${cacheData.date ? `/${cacheData.date}` : ''}`;
  }
  const fetchedData = fetchUrl ? await fetchData(fetchUrl, cacheData) : null;

  const [serverBundle, clientBundle, styleBundle] = await loadBundles(cacheData);
  const i18n = await loadI18n(cacheData);

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
    data: fetchedData,
    cardData: cardJson,
    customUrl: fetchUrl,
    state: parsedState,
    parlaState: parsedState,
    clientBundle,
    styleBundle,
    urls: data.urls,
    siteMap: data.siteMap,
    i18n: _.curry(_.get)(i18n, _, 'undefined i18n key'),
  };
  context.cardData.altHeader = JSON.stringify(cacheData.altHeader);

  const html = await rendererInstance.renderToString(context);
  cacheData.html = html;

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

  cardRender.lastAccessed = new Date();
  return cardRender.save();
}

function formattedDate(days = 0) {
  return dateFns.format(dateFns.addDays(new Date(), days), 'D.M.YYYY');
}

async function getRenderedCard(cacheData, forceRender, originalUrl) {
  const cardJson = await loadCardJson(cacheData);
  let renderedCard = null;
  if (!forceRender) {
    // eslint-disable-next-line no-console
    console.log(`Card: ${cacheData.group}/${cacheData.method} - TRYING CACHE`);
    renderedCard = await CardRender.findOne(cacheData).sort({ dateTime: -1 });
    if (renderedCard) {
      renderedCard.lastAccessed = new Date();
      renderedCard.save();
    }
  }
  if (!renderedCard || Number(cardJson.lastUpdate) !== Number(renderedCard.cardLastUpdate)) {
    // eslint-disable-next-line no-console
    console.log(`Card: ${cacheData.group}/${cacheData.method} - NOT CACHED (forceRender=${forceRender})`);
    if (await shouldBuildCard(cacheData, cardJson)) {
      // eslint-disable-next-line no-console
      console.log(`Card: ${cacheData.group}/${cacheData.method} - BUILDING`);
      await buildCard(cacheData, cardJson);
    }
    renderedCard = await renderCard(cacheData, cardJson, originalUrl);
  }
  return renderedCard;
}

const IS_VALID_CUSTOM_URL = /^https?:\/\/[^/]*\.parlamet[ea]r\.(?:si|hr)\//;

function render(req, res) {
  const { group, method } = req.params;
  const id = req.params.id || null;
  const date = req.params.date || formattedDate();
  const embed = !!req.query.embed;
  const frame = !!req.query.frame;
  const altHeader = !!req.query.altHeader;
  const customUrl = req.query.customUrl ? expandUrl(decodeURI(req.query.customUrl)) : null;
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
}

module.exports = {
  loadCardJson,
  shouldBuildCard,
  buildCard,
  render,
};

/* eslint-disable no-underscore-dangle */
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');
const fs = require('fs-extra');
const glob = require('glob');
const util = require('util');
const renderer = require('vue-server-renderer');
const { directive: t } = require('vue-i18n-extensions');
const exec = util.promisify(require('child_process').exec);
// TODO: remove this comment when vscode is fixed
// eslint-disable-next-line import/no-unresolved
const { performance } = require('perf_hooks');
const dateFns = require('date-fns');
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

function getRenders(req, res) {
  getModelObjects('CardRender', res, (doc) => {
    doc.html = `HTML length: ${doc.html.length}`;
    return doc;
  });
}

function getBuilds(req, res) {
  getModelObjects('CardBuild', res);
}

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

function deleteRenders(req, res) {
  clearModel('CardRender', res);
}

function deleteBuilds(req, res) {
  clearModel('CardBuild', res);
}

function deleteBuildId(req, res) {
  const CardBuild = mongoose.model('CardBuild');
  CardBuild.findByIdAndRemove(req.params.id)
    .then((obj) => {
      res.send({ deleted: !!obj });
    })
    .catch((err) => {
      res.status(400).send(err);
    });
}

async function loadCardJSON(cacheData) {
  const cardJson = await fs.readJson(`cards/${cacheData.group}/${cacheData.method}/card.json`);
  cardJson.lastUpdate = new Date(cardJson.lastUpdate);
  return cardJson;
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
  if (typeof dataUrl === 'string') {
    Object.keys(urlSlugs.urls).forEach((key) => {
      dataUrl = dataUrl.replace(`{${key}}`, urlSlugs.urls[key]);
    });
  }
  return dataUrl;
}

async function shouldBuildCard(cacheData, cardJson) {
  try {
    const CardBuild = mongoose.model('CardBuild');
    const cardBuild = await CardBuild.findOne({ group: cacheData.group, method: cacheData.method });
    if (!cardBuild) {
      return true;
    }
    if (urlSlugs.__lastUpdate && urlSlugs.__lastUpdate > Number(cardBuild.lastBuilt)) {
      return true;
    }
    if (Number(cardBuild.lastBuilt) !== Number(cardJson.lastUpdate)) {
      return true;
    }
    if (cardBuild.language !== config.cardLang) {
      return true;
    }
    if (expandUrl(cardBuild.dataUrl) !== expandUrl(cardJson.dataUrl)) {
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

async function buildCard(cacheData, cardJson) {
  const buildCommand = `node cards/build-cross-env.js ${cacheData.group}/${cacheData.method} build ${config.cardLang} --update-timestamp=false`;
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
  cardJson = await loadCardJSON(cacheData);
  const CardBuild = mongoose.model('CardBuild');
  await CardBuild.findOneAndUpdate(
    { group: cacheData.group, method: cacheData.method },
    {
      lastBuilt: cardJson.lastUpdate.toJSON(),
      language: config.cardLang,
      dataUrl: cardJson.dataUrl,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
  return cardJson;
}

async function renderCard(cacheData, cardJson, originalUrl) {
  cacheData.card = cardJson._id;
  cacheData.dataUrl = expandUrl(cardJson.dataUrl);
  cacheData.cardUrl = `${urlSlugs.urls.glej}${originalUrl}`;
  cacheData.cardLastUpdate = cardJson.lastUpdate;

  let fetchUrl;
  if (cacheData.customUrl) {
    fetchUrl = cacheData.customUrl;
  } else {
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
    directives: { t },
  });

  const parsedState = JSON.parse(cacheData.state);
  const context = {
    data,
    cardData: cardJson,
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

  cardRender.lastAccessed = new Date();
  return cardRender.save();
}

function formattedDate(days = 0) {
  return dateFns.format(dateFns.addDays(new Date(), days), 'D.M.YYYY');
}

async function getRenderedCard(cacheData, forceRender, originalUrl) {
  let cardJson = await loadCardJSON(cacheData);
  let renderedCard = null;
  if (!forceRender) {
    // eslint-disable-next-line no-console
    console.log(`Card: ${cacheData.group}/${cacheData.method} - TRYING CACHE`);
    const CardRender = mongoose.model('CardRender');
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
      cardJson = await buildCard(cacheData, cardJson);
    }
    renderedCard = await renderCard(cacheData, cardJson, originalUrl);
  }
  return renderedCard;
}

const IS_VALID_CUSTOM_URL = /^https?:\/\/[^/]*\.parlameter\.si\//;

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

function rebuildUpdated(req, res) {
  glob('./cards/**/card.json', (error, files) => {
    if (error) {
      res.status(500).send(error);
      return;
    }

    // set headers so browsers expect chunked text and don't buffer response
    // text while waiting for new data
    res.writeHead(200, {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'X-Content-Type-Options': 'nosniff',
    });

    const allCards = files
      .filter(f => !f.includes('_empty'))
      .map(f => (
        path.resolve(f)
          .replace(/\\/g, '/')
          .split('/')
          .slice(-3, -1)
      ))
      .map(([group, method]) => ({ group, method }));

    const maybeBuild = async (cacheData, i) => {
      res.write(`${i + 1} / ${allCards.length} | ${cacheData.group}/${cacheData.method}`);
      const cardJson = await loadCardJSON(cacheData);
      if (await shouldBuildCard(cacheData, cardJson)) {
        res.write(' - BUILDING ...');
        await buildCard(cacheData, cardJson);
        res.write(' DONE');
      }
      res.write('\n');
    };

    allCards.reduce((p, c, i) => p.then(() => maybeBuild(c, i)), Promise.resolve())
      .then(() => {
        res.end('\n\nEND');
      })
      .catch((pError) => {
        // eslint-disable-next-line no-console
        console.error(pError);
        res.end(`\n\nError: ${pError.message}`);
      });
  });
}

module.exports = {
  getRenders,
  getBuilds,
  deleteRenders,
  deleteBuilds,
  deleteBuildId,
  rebuildUpdated,
  render,
};

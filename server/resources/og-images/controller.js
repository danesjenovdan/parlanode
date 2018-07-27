const fs = require('fs-extra');
const path = require('path');
const util = require('util');
const exec = util.promisify(require('child_process').exec);
const mongoose = require('mongoose');
const renderer = require('vue-server-renderer');
// TODO: remove this comment when vscode is fixed
// eslint-disable-next-line import/no-unresolved
const { performance } = require('perf_hooks');
const config = require('../../../config');
const { takeScreenshot } = require('../../utils/screenshot');

const OgRender = mongoose.model('OgRender');
const OgBuild = mongoose.model('OgBuild');

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
  getModelObjects('OgRender', res);
}

function getBuilds(req, res) {
  getModelObjects('OgBuild', res);
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
  clearModel('OgRender', res);
}

function deleteBuilds(req, res) {
  clearModel('OgBuild', res);
}

async function loadOgJson(cacheData) {
  const ogJson = await fs.readJson(`og-images/${cacheData.name}/og.json`);
  ogJson.updated = new Date(ogJson.updated);
  return ogJson;
}

async function shouldBuildBundle(cacheData, ogJson) {
  try {
    const ogBuild = await OgBuild.findOne({ name: cacheData.name });
    if (!ogBuild) {
      return true;
    }
    if (Number(ogBuild.updated) !== Number(ogJson.updated)) {
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

// Store build commands that are currently in progress so we don't build
// the same thing twice at the same time
const ongoingBuilds = new Map();

async function buildBundle(cacheData, ogJson) {
  const buildCommand = `node og-images/build.js ${cacheData.name} build --dont-update-timestamp`;
  try {
    let promise;
    if (ongoingBuilds.has(buildCommand)) {
      promise = ongoingBuilds.get(buildCommand);
    } else {
      promise = exec(buildCommand);
      ongoingBuilds.set(buildCommand, promise);
    }
    await promise;
  } catch (error) {
    /* eslint-disable no-console */
    console.log(error.stdout);
    console.error(error.stderr);
    /* eslint-enable no-console */
    throw error;
  } finally {
    ongoingBuilds.delete(buildCommand);
  }
  await OgBuild.findOneAndUpdate(
    { name: cacheData.name },
    {
      built: new Date(),
      updated: ogJson.updated,
    },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  );
}

async function renderOgImage(cacheData, ogJson) {
  const serverBundle = await fs.readFile(`og-images/${cacheData.name}/bundles/server.js`, 'utf-8');
  const template = await fs.readFile('og-images/template.html', 'utf-8');

  const rendererInstance = renderer.createBundleRenderer(serverBundle, {
    template,
    runInNewContext: false,
  });

  const { name, ...params } = cacheData;
  const context = {
    params,
  };

  const html = await rendererInstance.renderToString(context);

  await OgRender.remove(cacheData);

  const ogRender = new OgRender({
    ...cacheData,
    updated: ogJson.updated,
  });

  await fs.writeFile(`${config.ogCapturePath}/${ogRender.id}.html`, html);

  await takeScreenshot(`${config.ogCapturePath}/${ogRender.id}.png`, {
    selector: '#og-container',
    url: `file:${path.resolve(`${config.ogCapturePath}/${ogRender.id}.html`)}`,
  });

  return ogRender.save();
}

async function getOgImage(cacheData, forceRender) {
  const ogJson = await loadOgJson(cacheData);
  let ogRender = null;
  if (!forceRender) {
    // eslint-disable-next-line no-console
    console.log(`OgImage: ${cacheData.name} - TRYING CACHE`);
    ogRender = await OgRender.findOne(cacheData).sort({ dateTime: -1 });
    if (ogRender) {
      ogRender.accessed = new Date();
      ogRender.save();
    }
  }
  if (!ogRender || Number(ogJson.updated) !== Number(ogRender.updated)) {
    // eslint-disable-next-line no-console
    console.log(`OgImage: ${cacheData.name} - NOT CACHED (forceRender=${forceRender})`);
    if (await shouldBuildBundle(cacheData, ogJson)) {
      // eslint-disable-next-line no-console
      console.log(`OgImage: ${cacheData.name} - BUILDING`);
      await buildBundle(cacheData, ogJson);
    }
    ogRender = await renderOgImage(cacheData, ogJson);
  }
  return ogRender;
}

function render(req, res) {
  const { name } = req.params;
  const { title, image, icon, acronym, h1, h2 } = req.query;

  const forceRender = !!req.query.forceRender;

  const cacheData = {
    name: name || '',
    title: title || '',
    image: image || '',
    icon: icon || '',
    acronym: acronym || '',
    h1: h1 || '',
    h2: h2 || '',
  };

  const startTime = performance.now();
  // eslint-disable-next-line no-console
  console.log(`OgImage: ${name} - START`);

  getOgImage(cacheData, forceRender)
    .then((ogRender) => {
      // eslint-disable-next-line no-console
      console.log(`OgImage: ${name} - END after ${Math.round(performance.now() - startTime)} ms`);
      if (ogRender && ogRender.id) {
        res.sendFile(path.resolve(`${config.ogCapturePath}/${ogRender.id}.png`));
      } else {
        res.status(500).send({ error: 'no og render' });
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
  getRenders,
  getBuilds,
  deleteRenders,
  deleteBuilds,
  render,
};

const fs = require('fs-extra');
const path = require('path');
const renderer = require('vue-server-renderer');
// TODO: remove this comment when vscode is fixed
// eslint-disable-next-line import/no-unresolved
const { performance } = require('perf_hooks');
const config = require('../../../config');
const { takeScreenshot } = require('../../utils/screenshot');
const data = require('../../data');

async function loadOgJson(cacheData) {
  const ogJson = await fs.readJson(`og-images/${cacheData.name}/og.json`);
  ogJson.updated = new Date(ogJson.updated);
  return ogJson;
}

async function renderOgImage(cacheData /* , ogJson */) {
  const [serverBundle, styleBundle] = await Promise.all([
    fs.readFile(`og-images/${cacheData.name}/bundles/server.js`, 'utf-8'),
    fs.readFile(`og-images/${cacheData.name}/bundles/style.css`, 'utf-8'),
  ]);
  const template = await fs.readFile('og-images/template.html', 'utf-8');

  const rendererInstance = renderer.createBundleRenderer(serverBundle, {
    template,
    runInNewContext: false,
  });

  const { name, ...params } = cacheData;
  const context = {
    params,
    styleBundle,
    urls: data.urls,
  };

  const html = await rendererInstance.renderToString(context);

  await fs.ensureDir(config.ogCapturePath);
  await fs.writeFile(`${config.ogCapturePath}/${cacheData.id}.html`, html);

  await takeScreenshot(`${config.ogCapturePath}/${cacheData.id}.png`, {
    selector: '#og-container',
    url: `file:${path.resolve(`${config.ogCapturePath}/${cacheData.id}.html`)}`,
  });
}

async function getOgImage(cacheData, forceRender) {
  const ogJson = await loadOgJson(cacheData);
  let ogRender = null;
  if (!forceRender) {
    // eslint-disable-next-line no-console
    console.log(`OgImage: ${cacheData.name} - TRYING CACHE`);
    // ogRender = await OgRender.findOne(cacheData).sort({ rendered: -1 });
    // if (ogRender) {
    //   ogRender.accessed = new Date();
    //   ogRender.save();
    // }
  }
  if (!ogRender || Number(ogJson.updated) !== Number(ogRender.updated)) {
    // eslint-disable-next-line no-console
    console.log(`OgImage: ${cacheData.name} - NOT CACHED (forceRender=${forceRender})`);
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
  loadOgJson,
  render,
};

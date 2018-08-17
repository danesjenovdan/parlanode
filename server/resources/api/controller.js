const fs = require('fs-extra');
const path = require('path');
const mongoose = require('mongoose');
const glob = require('glob');
const config = require('../../../config');
const { loadCardJson, shouldBuildCard, buildCard } = require('../cards/controller');
const { loadOgJson, shouldBuildBundle, buildBundle } = require('../og-images/controller');

function getAllCardPaths() {
  return new Promise((resolve, reject) => {
    glob('./cards/**/card.json', (error, files) => {
      if (error) {
        reject(error);
        return;
      }
      const allCards = files
        .filter(f => !f.includes('_empty'))
        .map(f => (
          path.resolve(f)
            .replace(/\\/g, '/')
            .split('/')
            .slice(-3, -1)
        ))
        .map(([group, method]) => ({ group, method }));

      resolve(allCards);
    });
  });
}

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

function getCardRenders(req, res) {
  getModelObjects('CardRender', res, (doc) => {
    doc.html = `HTML length: ${doc.html.length}`;
    return doc;
  });
}

function getCardBuilds(req, res) {
  getModelObjects('CardBuild', res);
}

function clearModel(modelName) {
  const Model = mongoose.model(modelName);
  return Model.remove({});
}

function deleteCardRenders(req, res) {
  clearModel('CardRender')
    .then((obj) => {
      res.send(obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteCardBuilds(req, res) {
  clearModel('CardBuild', res)
    .then(async (obj) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const card of await getAllCardPaths()) {
        // eslint-disable-next-line no-await-in-loop
        await fs.remove(`./cards/${card.group}/${card.method}/bundles`);
      }
      res.send(obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteCardRenderId(req, res) {
  const CardRender = mongoose.model('CardRender');
  CardRender.findByIdAndRemove(req.params.id)
    .then((obj) => {
      res.send({ deleted: !!obj });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteCardBuildId(req, res) {
  const CardBuild = mongoose.model('CardBuild');
  CardBuild.findByIdAndRemove(req.params.id)
    .then(async (obj) => {
      if (obj) {
        await fs.remove(`./cards/${obj.group}/${obj.method}/bundles`);
      }
      res.send({ deleted: !!obj });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function progressDots(res) {
  const wave = "`'-.,_,.-'";
  let i = 0;
  let interval = null;
  let time = null;
  return {
    start() {
      time = Date.now();
      interval = setInterval(() => {
        res.write(wave[i % wave.length]);
        i += 1;
      }, 1000);
    },
    stop() {
      time = Date.now() - time;
      clearInterval(interval);
      interval = null;
    },
    get time() {
      return time;
    },
  };
}

async function maybeBuildCard(cacheData, index, length, forceBuild, res) {
  res.write(`${index + 1} / ${length} | ${cacheData.group}/${cacheData.method}`);
  const cardJson = await loadCardJson(cacheData);
  if (forceBuild || await shouldBuildCard(cacheData, cardJson)) {
    res.write(' - BUILDING ');
    res.progressDots = progressDots(res);
    res.progressDots.start();
    await buildCard(cacheData, cardJson);
    res.progressDots.stop();
    res.write(` DONE in ${(res.progressDots.time / 1000).toFixed(2)}s`);
  }
  res.write('\n');
}

function rebuildCards(forceBuild) {
  return (req, res) => {
    getAllCardPaths()
      .then((allCards) => {
        // set headers so browsers expect chunked text and don't buffer response
        // text while waiting for new data
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'X-Content-Type-Options': 'nosniff',
        });

        allCards.reduce((p, c, i) => (
          p.then(() => maybeBuildCard(c, i, allCards.length, forceBuild, res))
        ), Promise.resolve())
          .then(() => {
            res.end('\n\nEND');
          })
          .catch((pError) => {
            if (res.progressDots) {
              res.progressDots.stop();
            }
            // eslint-disable-next-line no-console
            console.error(pError);
            res.end(`\n\nError: ${pError.message}`);
          });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  };
}

function getAllOgPaths() {
  return new Promise((resolve, reject) => {
    glob('./og-images/**/og.json', (error, files) => {
      if (error) {
        reject(error);
        return;
      }
      const allOgs = files
        .filter(f => !f.includes('_empty'))
        .map(f => (
          path.resolve(f)
            .replace(/\\/g, '/')
            .split('/')
            .slice(-2, -1)
        ))
        .map(([name]) => ({ name }));

      resolve(allOgs);
    });
  });
}

function getOgRenders(req, res) {
  getModelObjects('OgRender', res);
}

function getOgBuilds(req, res) {
  getModelObjects('OgBuild', res);
}

function deleteOgRenders(req, res) {
  clearModel('OgRender', res)
    .then(async (obj) => {
      await fs.remove(`${config.ogCapturePath}`);
      res.send(obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteOgBuilds(req, res) {
  clearModel('OgBuild', res)
    .then(async (obj) => {
      // eslint-disable-next-line no-restricted-syntax
      for (const og of await getAllOgPaths()) {
        // eslint-disable-next-line no-await-in-loop
        await fs.remove(`./og-images/${og.name}/bundles`);
      }
      res.send(obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteOgRenderId(req, res) {
  const OgRender = mongoose.model('OgRender');
  OgRender.findByIdAndRemove(req.params.id)
    .then(async (obj) => {
      if (obj) {
        await fs.remove(`${config.ogCapturePath}/${obj.id}.html`);
        await fs.remove(`${config.ogCapturePath}/${obj.id}.png`);
      }
      res.send({ deleted: !!obj });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteOgBuildId(req, res) {
  const OgBuild = mongoose.model('OgBuild');
  OgBuild.findByIdAndRemove(req.params.id)
    .then(async (obj) => {
      if (obj) {
        await fs.remove(`./og-images/${obj.name}/bundles`);
      }
      res.send({ deleted: !!obj });
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

async function maybeBuildOg(cacheData, index, length, forceBuild, res) {
  res.write(`${index + 1} / ${length} | ${cacheData.name}`);
  const ogJson = await loadOgJson(cacheData);
  if (forceBuild || await shouldBuildBundle(cacheData, ogJson)) {
    res.write(' - BUILDING ...');
    await buildBundle(cacheData, ogJson);
    res.write(' DONE');
  }
  res.write('\n');
}

function rebuildOgs(forceBuild) {
  return (req, res) => {
    getAllOgPaths()
      .then((allOgs) => {
        // set headers so browsers expect chunked text and don't buffer response
        // text while waiting for new data
        res.writeHead(200, {
          'Content-Type': 'text/plain; charset=utf-8',
          'Transfer-Encoding': 'chunked',
          'X-Content-Type-Options': 'nosniff',
        });

        allOgs.reduce((p, c, i) => (
          p.then(() => maybeBuildOg(c, i, allOgs.length, forceBuild, res))
        ), Promise.resolve())
          .then(() => {
            res.end('\n\nEND');
          })
          .catch((pError) => {
            // eslint-disable-next-line no-console
            console.error(pError);
            res.end(`\n\nError: ${pError.message}`);
          });
      })
      .catch((err) => {
        res.status(500).send(err);
      });
  };
}

module.exports = {
  getCardRenders,
  getCardBuilds,
  deleteCardRenders,
  deleteCardBuilds,
  deleteCardRenderId,
  deleteCardBuildId,
  rebuildCards,
  getOgRenders,
  getOgBuilds,
  deleteOgRenders,
  deleteOgBuilds,
  deleteOgRenderId,
  deleteOgBuildId,
  rebuildOgs,
};

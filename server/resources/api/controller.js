const fs = require('fs-extra');
const path = require('path');
const mongoose = require('mongoose');
const glob = require('glob');
const { CronJob } = require('cron');
const config = require('../../../config');
const data = require('../../data');
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
        .map(([group, method]) => ({ group, method, language: config.cardLang }));

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
  const CardRender = mongoose.model('CardRender');
  Promise.all([
    CardRender.countDocuments(),
    CardRender.aggregate([
      {
        $group: {
          _id: { $concat: ['$group', '/', '$method'] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      {
        $group: {
          _id: null,
          counts: { $push: { k: '$_id', v: '$count' } },
        },
      },
      {
        $replaceRoot: {
          newRoot: { $arrayToObject: '$counts' },
        },
      },
    ]),
  ])
    .then(([count, counts]) => {
      res.send({
        count,
        counts: counts[0],
      });
    })
    .catch((error) => {
      res.status(500).send({
        error,
      });
    });
}

function getCardBuilds(req, res) {
  getModelObjects('CardBuild', res);
}

function clearModel(modelName, req) {
  const Model = mongoose.model(modelName);

  let query = Model.find();
  if (req && req.query && req.query.group) {
    query = query.where('group', req.query.group);
  }
  if (req && req.query && req.query.method) {
    query = query.where('method', req.query.method);
  }
  if (req && req.query && req.query.id) {
    query = query.where('id', req.query.id);
  }

  return query.deleteMany();
}

function deleteOldCardRendersFromDB(days = 28) {
  const CardRender = mongoose.model('CardRender');
  const time = (1000 * 60 * 60 * 24 * days);

  // eslint-disable-next-line no-console
  console.log(`Deleting renders accessed more than ${days} days ago ...`);
  return CardRender.deleteMany({
    lastAccessed: { $lte: Date.now() - time },
  })
    .then(async (obj) => {
      // eslint-disable-next-line no-console
      console.log('Finished deleting old renders');
      const res = { old: obj };

      const LIMIT = 1000;
      // eslint-disable-next-line no-console
      console.log('Deleting renders over limit of 1000 ...');
      const count = await CardRender.countDocuments();
      if (count > LIMIT) {
        const objs = await CardRender.find().select('_id')
          .sort({ dateTime: 1 })
          .limit(Math.max(count - Math.floor(LIMIT / 2), 0));
        // eslint-disable-next-line no-underscore-dangle
        const ids = objs.map(o => o._id);
        const obj2 = await CardRender.deleteMany({ _id: { $in: ids } });
        res.overLimit = obj2;
        // eslint-disable-next-line no-console
        console.log('Finished deleting renders over limit');
      }

      return [null, res];
    })
    .catch((err) => {
      // eslint-disable-next-line no-console
      console.error('Failed deleting old renders:', err);
      return [err, null];
    });
}

function deleteOldCardRenders(req, res) {
  const days = Number(req.query.days) || 28;
  Promise.resolve()
    .then(() => deleteOldCardRendersFromDB(days))
    .then(([err, obj]) => {
      if (err) {
        res.status(500).send(err);
      } else {
        res.json(obj);
      }
    });
}

function deleteCardRenders(req, res) {
  clearModel('CardRender', req)
    .then((obj) => {
      res.send(obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteCardBuilds(req, res) {
  // dont allow filtering by person/party id since it doesn't exist on builds
  req.query.id = undefined;

  clearModel('CardBuild', req)
    .then(async (obj) => {
      let allCards = await getAllCardPaths();
      if (req && req.query && req.query.group) {
        allCards = allCards.filter(c => c.group === req.query.group);
      }
      if (req && req.query && req.query.method) {
        allCards = allCards.filter(c => c.method === req.query.method);
      }
      // eslint-disable-next-line no-restricted-syntax
      for (const card of allCards) {
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
    const dots = progressDots(res);
    dots.start();
    try {
      await buildCard(cacheData, cardJson);
    } catch (error) {
      throw error;
    } finally {
      dots.stop();
    }
    res.write(` DONE in ${(dots.time / 1000).toFixed(2)}s`);
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
          'X-Accel-Buffering': 'no',
        });

        allCards.reduce((p, c, i) => (
          p.then(() => maybeBuildCard(c, i, allCards.length, forceBuild, res))
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
  const OgRender = mongoose.model('OgRender');
  Promise.all([
    OgRender.countDocuments(),
    OgRender.findOne().sort('rendered'),
    OgRender.findOne().sort('accessed'),
  ])
    .then(([count, oldest, stalest]) => {
      res.send({
        count,
        oldest,
        stalest,
      });
    })
    .catch((error) => {
      res.status(500).send({
        error,
      });
    });
}

function getOgBuilds(req, res) {
  getModelObjects('OgBuild', res);
}

function deleteOgRenders(req, res) {
  clearModel('OgRender')
    .then(async (obj) => {
      await fs.remove(`${config.ogCapturePath}`);
      res.send(obj);
    })
    .catch((err) => {
      res.status(500).send(err);
    });
}

function deleteOgBuilds(req, res) {
  clearModel('OgBuild')
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
          'X-Accel-Buffering': 'no',
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

function refetchData(req, res) {
  Promise.resolve()
    .then(() => data.refetch())
    .then((error) => {
      if (!error) {
        res.json({
          ok: true,
          message: 'Finished refetch',
        });
      } else {
        res.json({
          ok: false,
          message: 'Failed refetch',
          error,
        });
      }
    });
}

function listLegislationIcons(req, res) {
  fs.readdir('./parlassets/icons/legislation')
    .then((files) => {
      const icons = files.filter(f => f.toLowerCase() !== 'readme.md');
      res.json({
        icons,
      });
    })
    .catch((pError) => {
      // eslint-disable-next-line no-console
      console.error(pError);
      res.send(`Error: ${pError.message}`);
    });
}

// delete old card renders every day at 3am
const cron = new CronJob('00 03 * * *', () => deleteOldCardRendersFromDB(14));
cron.start();

module.exports = {
  getCardRenders,
  getCardBuilds,
  deleteOldCardRenders,
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
  refetchData,
  listLegislationIcons,
};

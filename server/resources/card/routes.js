const { startOfTomorrow } = require('date-fns');
const controller = require('./controller');

function setIntervalMidnight(func) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const safeFunc = () => {
    try {
      func();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };
  setTimeout(() => {
    safeFunc();
    setInterval(safeFunc, ONE_DAY);
  }, startOfTomorrow() - Date.now());
}

module.exports = (app) => {
  app.get('/api/cards/getRenders', controller.getRenders);
  app.get('/api/cards/getBuilds', controller.getBuilds);
  app.get('/api/cards/deleteRenders', controller.deleteRenders);
  app.get('/api/cards/deleteBuilds', controller.deleteBuilds);
  app.get('/api/cards/deleteBuild/:id', controller.deleteBuildId);
  app.get('/api/cards/cleanUp', controller.cleanUp);

  app.get('/:group/:method/', controller.render);
  app.get('/:group/:method/:id(\\d+)/', controller.render);
  app.get('/:group/:method/:id(\\d+)/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);
  app.get('/:group/:method/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);

  // run every day at midnight
  setIntervalMidnight(controller.cleanUp);
};

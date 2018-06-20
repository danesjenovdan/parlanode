const controller = require('./controller');
const { startOfTomorrow } = require('date-fns');

function setIntervalMidnight(func) {
  const ONE_DAY = 1000 * 60 * 60 * 24;
  const safeFunc = () => {
    try {
      func();
    } catch (error) {
      console.error(error);
    }
  };
  setTimeout(() => {
    safeFunc();
    setInterval(safeFunc, ONE_DAY);
  }, 5000 /* startOfTomorrow() - Date.now() */);
}

module.exports = (app) => {
  app.get('/api/cards/getRenders', controller.getRenders);
  app.get('/api/cards/getBuilds', controller.getBuilds);
  app.get('/api/cards/deleteRenders', controller.deleteRenders);
  app.get('/api/cards/deleteBuilds', controller.deleteBuilds);

  app.get('/:group/:method/', controller.render);
  app.get('/:group/:method/:id(\\d+)/', controller.render);
  app.get('/:group/:method/:id(\\d+)/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);
  app.get('/:group/:method/:date(\\d{1,2}.\\d{1,2}.\\d{4})/', controller.render);

  app.get('*', (req, res) => {
    res.status(400).send({ error: 'Bad Request' });
  });

  // run every day at midnight
  setIntervalMidnight(controller.cleanUp);
};

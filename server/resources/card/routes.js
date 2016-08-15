
const controller = require('./controller');
const authMiddleware = require('../../middlewares/auth');

module.exports = function(app){

    app.delete('/api/card/:id', authMiddleware, controller.delete);

    app.get('/:group/:method/:id/*', controller.render);

    app.get('/api/card', authMiddleware, controller.get);

    app.post('/api/card', authMiddleware, controller.save);

    app.put('/api/card/:id', authMiddleware, controller.update);

};
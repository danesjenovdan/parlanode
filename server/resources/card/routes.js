/**
 * Created by francizidar on 21/02/16.
 */

var controller = require('./controller');


module.exports = function(app){

    app.delete('/api/card/:id', controller.delete);

    app.get('/:group/:method/:id/*', controller.render);

    app.get('/api/card', controller.get);

    app.post('/api/card', controller.save);

    app.put('/api/card/:id', controller.update);

    //app.post('/api/render/');



};
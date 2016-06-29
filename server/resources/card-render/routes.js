/**
 * Created by francizidar on 21/02/16.
 */

var controller = require('./controller');


module.exports = function(app){

    app.delete('/api/card-render/:id', controller.delete);

    app.get('/api/card-render', controller.get);

    app.post('/api/card-render', controller.save);

    app.put('/api/card-render/:id', controller.update);

    //app.post('/api/render/');

    app.get('/:group/:method/:id/*', controller.render);

};
const controller = require('./controller');

module.exports = (app)=>{

    app.post(`${CFG.apiPrefix}/login`, controller.login);

};
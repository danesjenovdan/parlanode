const controller = require('./controller');
const authMiddleware = require('../../middlewares/auth');

module.exports = (app)=>{

    app.post(`${CFG.apiPrefix}/login`, controller.login);

    app.post(`${CFG.apiPrefix}/checkLogin`, authMiddleware, controller.isLoggedIn);

};
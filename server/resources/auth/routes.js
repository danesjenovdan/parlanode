const controller = require('./controller');
const authMiddleware = require('../../middlewares/auth');

module.exports = (app)=>{

    app.post('/api/login', controller.login);
    app.post('/api/checkLogin', authMiddleware, controller.isLoggedIn);

};
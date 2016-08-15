/**
 * Created by francizidar on 21/02/16.
 */

module.exports = function(app){

    require('./card')(app);
    require('./auth')(app);
    require('./token')(app);

    return true;

};
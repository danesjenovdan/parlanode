/**
 * Created by francizidar on 21/02/16.
 */

module.exports = function(app){
    return {

            controller  : require('./model'),
            routes      : require('./routes')(app)


    }
};
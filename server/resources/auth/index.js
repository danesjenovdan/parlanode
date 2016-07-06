/**
 * Created by francizidar on 21/02/16.
 */

module.exports = function(app){
    return {

        routes      : require('./routes')(app)

    }
};
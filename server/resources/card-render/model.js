/**
 * Created by francizidar on 21/02/16.
 */
var mongoose = require('mongoose');

var schema = mongoose.Schema({

    dateTime        : { type:Date, default:Date.now },
    dataUrl         : { type:String, required:true},
    html            : String,
    card            : { type:String, ref:'Card'},
    cardUrl         : String,

    group           : { type:String, index:true, required:true },
    method          : { type:String, index:true, required:true },
    embed           : Boolean,
    frame           : Boolean,
    altHeader       : Boolean,
    customUrl       : String,
    id              : String,
    date            : String


});

mongoose.model('CardRender', schema);
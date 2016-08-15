/**
 * Created by francizidar on 21/02/16.
 */
var mongoose = require('mongoose');

var schema = mongoose.Schema({

    dateCreated : { type:Date, default:Date.now },
    value       : { type:String },
    dateExpires : { type:Date, default:()=>{ return + Date.now()+1000*60*60*24*14 }},
    userData    : Object

});

mongoose.model('Token', schema);
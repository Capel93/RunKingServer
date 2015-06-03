var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var routeSchema = new Schema({
    startPoint : String,
    finishPoint : String,
    date : String,
    time : Number,
    distance: Number,
    longitudes : Array,
    latitudes : Array,
    email: String
});

var Route = mongoose.model('Route', routeSchema);
module.exports = Route;



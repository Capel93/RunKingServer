/**
 * Created by joanmarc on 2/06/15.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    email : { type: String, required: true, unique: true },
    username : String,
    password : String,
    friends : Array,
    routes : Array
});

var User = mongoose.model('User', userSchema);
module.exports = User;





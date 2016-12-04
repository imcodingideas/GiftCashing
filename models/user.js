const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    aliasFirstName: String,
    aliasLastName: String,
    username: String,
    phone: String,
    password: String,
    isAdmin: Boolean,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: Number
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
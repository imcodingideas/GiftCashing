const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    alaisFirstName: String,
    alaisLastName: String,
    username: String,
    password: String,
    isAdmin: Boolean,
    addressLine1: String,
    addressLine2: String,
    city: String,
    state: String,
    zipCode: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
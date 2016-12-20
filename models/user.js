const mongoose = require('mongoose'),
      passportLocalMongoose = require('passport-local-mongoose');

var UserSchema = new mongoose.Schema({
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
    zipCode: Number,
    profilePic: String, // expects a data url for the image
    preferredPaymentMethod: {
      type: String,
      enum: ["", "paypal", "check", "deposit"],
      default: ""
    },
    paymentPreference:  {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'PaymentPreference'
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);

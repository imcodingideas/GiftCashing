/*jshint esversion: 6 */
const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Types = Schema.Types,
  passportLocalMongoose = require('passport-local-mongoose');

const paymentPreference = {
    paypalEmail:Types.String,
    check: {
      addressLine1: Types.String,
      addressLine2: Types.String,
      city: Types.String,
      state: Types.String,
      zipCode: Types.String
    }
};

let UserSchema = new mongoose.Schema({
  firstName: Types.String,
  lastName: Types.String,
  aliasFirstName: Types.String,
  aliasLastName: Types.String,
  username: Types.String,
  phone: Types.String,
  password: Types.String,
  isAdmin: {
    type: Types.Boolean,
    default: false
  },
  addressLine1: Types.String,
  addressLine2: Types.String,
  city: Types.String,
  state: Types.String,
  zipCode: Types.Number,
  profilePic: {
    type: Types.String,
    default: 'https://s.gravatar.com/avatar/0a07df079fd7a07e4cd0e5668835296c?s=80'
  },
  preferredPaymentMethod: {
    type: Types.String,
    enum: ['', 'paypal', 'check', 'deposit'],
    default: ''
  },
  paymentPreference: {
    type: paymentPreference
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
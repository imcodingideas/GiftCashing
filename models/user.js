/*jshint esversion: 6 */
const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Types = Schema.Types,
  passportLocalMongoose = require('passport-local-mongoose');

let UserSchema = new mongoose.Schema({
  firstName: Types.String,
  lastName: Types.String,
  aliasFirstName: Types.String,
  aliasLastName: Types.String,
  username: Types.String,
  phone: Types.String,
  password: Types.String,
  isAdmin: Types.Boolean,
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
    paypal: {
      email: {
        type: Types.String,
        default: ''
      }
    },
    check: {
      addressLine1: {
        type: Types.String,
        default: ''
      },
      addressLine2: {
        type: Types.String,
        default: ''
      },
      city: {
        type: Types.String,
        default: ''
      },
      state: {
        type: Types.String,
        default: ''
      },
      zipCode: {
        type: Types.Number,
        default: ''
      }
    },
    deposit: {
      routingOrTransit: {
        type: Types.String,
        default: ''
      },
      accountNumber: {
        type: Types.String,
        default: ''
      }
    }
  },
  lastLoginDate: {
    type: Date,
    default: Date.now
  }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
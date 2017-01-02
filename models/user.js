/*jshint esversion: 6 */
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
	zipCode: Number,
	profilePic: {
		type: String,
		default: 'https://s.gravatar.com/avatar/0a07df079fd7a07e4cd0e5668835296c?s=80'
	},
	preferredPaymentMethod: {
		type: String,
		enum: ['', 'paypal', 'check', 'deposit'],
		default: ''
	},
	paymentPreference: {
		paypal: {
			email: {
				type: String,
				default: ''
			}
		},
		check: {
			addressLine1: {
				type: String,
				default: ''
			},
			addressLine2: {
				type: String,
				default: ''
			},
			city: {
				type: String,
				default: ''
			},
			state: {
				type: String,
				default: ''
			},
			zipCode: {
				type: Number,
				default: ''
			}
		},
		deposit: {
			routingOrTransit: {
				type: String,
				default: ''
			},
			accountNumber: {
				type: String,
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
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
	profilePic: String,
	preferredPaymentMethod: {
		type: String,
		enum: ['', 'paypal', 'check', 'deposit'],
		default: ''
	},
	paymentPreference: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'PaymentPreference'
	},
	lastLoginDate: {
		type: Date,
		default: Date.now
	}
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);
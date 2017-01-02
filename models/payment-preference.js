/*jshint esversion: 6 */
const mongoose = require('mongoose');

let paymentPreferenceSchema = new mongoose.Schema({
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
});

module.exports = mongoose.model('PaymentPreference', paymentPreferenceSchema);
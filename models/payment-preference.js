const mongoose = require('mongoose');

var paymentPreferenceSchema = new mongoose.Schema({
    paypal: {
        email: String
    },
    check: {
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        zipCode: Number
    },
    deposit: {
        routingOrTransit: String,
        accountNumber: String
    }
});

module.exports = mongoose.model('PaymentPreference', paymentPreferenceSchema);
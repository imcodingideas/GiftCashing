/**
 * Created by joseph on 12/2/16.
 */
const mongoose = require('mongoose');

// Schema Setup
var giftSchema = new mongoose.Schema({
    username: String,
	giftNumber: Number,
    date: Date,
    status: {
        review: String,
        accepted: {
            type: String,
            redeemed: Boolean
        },
        declined: String,
        expired: String,
        pending: String,
        paid: String
    },
    giftDescription: String,
	giftAmount: Number,
	giftCode: String,
	redeemCode: String,
	passCode: String,
	senderFirstName: String,
	senderLastName: String,
	giftMessage: String
});

module.exports = mongoose.model('Gift', giftSchema);

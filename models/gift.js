/**
 * Created by joseph on 12/2/16.
 */
'use strict';
const mongoose = require('mongoose');

// Schema Setup
let giftSchema = new mongoose.Schema({
	gift: String,
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
	giftAmount: String,
	giftCode: String,
	redeemCode: String,
	passCode: String,
	senderFirstName: String,
	senderLastName: String,
	giftMessage: String,
    username: String
});

module.exports = mongoose.model('Gift', giftSchema);
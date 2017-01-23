/*jshint esversion: 6 */
/**
 * Created by joseph on 12/2/16.
 */

const
  mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  Types = Schema.Types;

const statusSchema = {
  review: Types.Boolean,
  accepted: Types.Boolean,
  declined: Types.Boolean,
  redeemed: Types.Boolean,
  paid: Types.Boolean
};

const GiftSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  giftNumber: {
    type: Types.Number,
    unique: true,
    required: true
  },
  date: Date,
  status: {
    type: statusSchema,
    default: {
      review: true,
      accepted: false,
      redeemed: false,
      declined: false,
      paid: false
    }
  },
  giftDescription: Types.String,
  giftAmount: Types.Number,
  giftCode: Types.String,
  redeemCode: Types.String,
  passCode: Types.String,
  senderFirstName: Types.String,
  senderLastName: Types.String,
  giftMessage: Types.String,
  changedStatusDate: Types.Date
});

module.exports = mongoose.model('Gift', GiftSchema);
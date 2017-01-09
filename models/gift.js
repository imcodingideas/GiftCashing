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
  redeemed: Types.Boolean,
  declined: Types.Boolean,
  expired: Types.Boolean,
  pending: Types.Boolean,
  paid: Types.Boolean
};

const GiftSchema = new Schema({
  user: {
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  giftNumber: Types.Number,
  date: Date,
  status: {
    type: statusSchema,
    default: {
      review: true,
      accepted: false,
      redeemed: false,
      declined: false,
      expired: false,
      pending: false,
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
  giftMessage: Types.String
});

module.exports = mongoose.model('Gift', GiftSchema);
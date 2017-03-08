/*jshint esversion: 6 */
const nodemailer = require('nodemailer'),
  mg = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: 'key-12e1c4cc25659a09c9d0f590158f6996',
    domain: 'mg.giftcashing.com'
  }
}

const smtpTransport = nodemailer.createTransport(mg(auth));

module.exports = smtpTransport;
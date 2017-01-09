/*jshint esversion: 6 */
const nodemailer = require('nodemailer'),
  mg = require('nodemailer-mailgun-transport');

let auth = {
  auth: {
    api_key: 'key-8a976a9cba0ee1e86ec07d7398b544e8',
    domain: 'mg.giftcashing.com'
  }
}

let smtpTransport = nodemailer.createTransport(mg(auth));

module.exports = smtpTransport;
/*jshint esversion: 6 */
const nodemailer = require('nodemailer'),
  mg = require('nodemailer-mailgun-transport');

let auth = {
  auth: {
    api_key: 'key-8a976a9cba0ee1e86ec07d7398b544e8',
    domain: 'sandboxb1fd7de656fe403591f3528498bfd132.mailgun.org'
  }
}

let smtpTransport = nodemailer.createTransport(mg(auth));

module.exports = smtpTransport;
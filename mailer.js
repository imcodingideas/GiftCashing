const nodemailer = require('nodemailer'),
      mg = require('nodemailer-mailgun-transport');

let smtpTransport = nodemailer.createTransport(mg(auth));

smtpTransport.sendMail({
    host: 'smtp.mailgun.org',
    auth: {
        from: 'joseph@michael-chambers.com',
        api_key: 'key-8a976a9cba0ee1e86ec07d7398b544e8',
        domain: 'sandboxb1fd7de656fe403591f3528498bfd132.mailgun.org'
    }
});

module.exports = smtpTransport;

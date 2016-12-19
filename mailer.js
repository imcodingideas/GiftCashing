var nodemailer = require("nodemailer");
// NOTE:  Change the values below to your own SMTP server. Mailgun is recommended for prod usage
var smtpTransport = nodemailer.createTransport({
  host: 'smtp-pulse.com',
  port: 465,
  secure: true, // use SSL
  auth: {
      user: 's26c.sayan@gmail.com',
      pass: 'Gne7SFoGLJ75B'
  }
});

module.exports = smtpTransport;

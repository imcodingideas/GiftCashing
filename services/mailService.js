
const mailer = require('../mailer');
let emailOptions = {
  from: 'joseph@michael-chambers.com',
  to: '',
  subject: '',
  html: ''
};

var sendMail = function (emailOptions) {
    mailer.sendMail(emailOptions, (err, info) => {
        if (err) console.log('Mailing Error: ', err);
        console.log('mailing......................', info);
    });
};

module.exports.sendForgotPassword = function (user, password){
    emailOptions.to = user.username;
    emailOptions.subject = 'Forgot account';
    emailOptions.html = `
            <p>Dear ${user.firstName} ${user.lastName},</p>
            <p>Your password are is restored, please visit the Login Page for access with the new password.</p>
            <p>New password: <strong>${password}</strong></p>
            <p>Best Regards,<br/>
            GiftCashing.com</p>`;

    sendMail(emailOptions);
};

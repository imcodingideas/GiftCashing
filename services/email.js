const mailer = require('../mailer');
let emailOptions = {
  from: 'joseph@michael-chambers.com',
  to: '',
  subject: '',
  html: ''
};

module.exports.sendForgotPassword = function(user, password) {
  emailOptions.to = user.username;
  emailOptions.subject = 'Forgot account';
  emailOptions.html = `
	        <p>Dear ${user.firstName} ${user.lastName},</p>
	        <p>Your password are is restored, please visit the Login Page for access with the new password.</p>
	        <p>New password: <strong>${password}</strong></p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;
  
  mailer.sendMail(emailOptions, (err, info) => {
    if(err) console.log('Mailing Error: ', err);
    console.log('mailing......................', info);
  });
};

module.exports.giftStatusIsReview = function(user) {
  emailOptions.to = user.username;
  emailOptions.subject = 'You have received a new gift';
  emailOptions.html = `
	        <p>Dear ${user.firstName} ${user.lastName},</p>
	        <p>You have received a gift from senderFirstName senderLastName.</p>
	        <p>Access your online account and review the gift details. Then, decide whether you want to accept it.</p>
	        <p>Remember, you have 30 days to decide or else the gift will be returned.</p>
	        <p>Contact us with any questions/concerns at support@giftcashing.com.</p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;
  
  mailer.sendMail(emailOptions, (err, info) => {
    if(err) console.log('Mailing Error: ', err);
    console.log('mailing......................', info);
  });
};

module.exports.giftStatusIsPaid = function(user) {
  emailOptions.to = user.username;
  emailOptions.subject = 'Your have been paid.';
  emailOptions.html = `
	        <p>Dear ${user.firstName} ${user.lastName},</p>
	        <p>Great News! You have been paid for your gift. The money is on the way based on your payment preference.</p>
	        <p>Contact us with any questions/concerns at support@giftcashing.com.</p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;
  
  mailer.sendMail(emailOptions, (err, info) => {
    if(err) console.log('Mailing Error: ', err);
    console.log('mailing......................', info);
  });
};

module.exports.giftStatusIsReviewOverSevenDays = function(user) {
  emailOptions.to = user.username;
  emailOptions.subject = 'Hurry and Claim Your Gift!';
  emailOptions.html = `
	        <p>Dear ${user.firstName} ${user.lastName},</p>
	        <p>Don’t forget, you have received a gift from senderFirstName senderLastName</p>
	        <p>Access your online account and review the gift details. Then, decide whether you want to accept it.</p>
	        <p>Hurry before it expires.</p>
	        <p>Contact us with any questions/concerns at support@giftcashing.com.</p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;
  
  mailer.sendMail(emailOptions, (err, info) => {
    if(err) console.log('Mailing Error: ', err);
    console.log('mailing......................', info);
  });
};
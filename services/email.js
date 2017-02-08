const mailer = require('../mailer');
let emailOptions = {
  from: 'joseph@michael-chambers.com',
  to: '',
  subject: '',
  html: ''
};

let sendMail = (emailOptions) => {
  mailer.sendMail(emailOptions, (err, info) => {
    if (err) console.log('Mailing Error: ', err);
    console.log('mailing......................', info);
  });
};

module.exports.sendForgotPassword = (user, password) => {
  emailOptions.to = user.username;
  emailOptions.subject = 'Gift Cashing New Password';
  emailOptions.html = `
	        <p>Dear ${user.firstName} ${user.lastName},</p>
	        <p>Your password are is restored, please visit the Login Page for access with the new password.</p>
	        <p>New password: <strong>${password}</strong></p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;

  sendMail(emailOptions);
};

module.exports.giftStatusIsReview = (user, gift) => {
  emailOptions.to = user.username;
  emailOptions.subject = 'You have received a new gift';
  emailOptions.html = `
	        <p>Dear ${user.firstName} ${user.lastName},</p>
	        <p>You have received a gift from ${gift.senderFirstName} ${gift.senderLastName}.</p>
	        <p>Access your online account and review the gift details. Then, decide whether you want to accept it.</p>
	        <p>Contact us with any questions/concerns at support@giftcashing.com.</p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;

  sendMail(emailOptions);
};

module.exports.giftStatusIsPaid = (user) => {
  emailOptions.to = user.username;
  emailOptions.subject = 'Your have been paid.';
  emailOptions.html = `
	        <p>Dear ${user.firstName} ${user.lastName},</p>
	        <p>Great News! You have been paid for your gift. The money is on the way based on your payment preference.</p>
	        <p>Contact us with any questions/concerns at support@giftcashing.com.</p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;

  sendMail(emailOptions);
};

module.exports.sendContact = (contact) => {
  emailOptions.to = emailOptions.from;
  emailOptions.subject = 'Gift Cashing | Contact';
  emailOptions.html = `
          <p>You have a new message from the contact form:</p>
          <p>Email: ${contact.email}</p>
          <p>Message:</p>
          <p>${contact.message} <br/>
            GiftCashing.com </p>
        `;
  sendMail(emailOptions);
};


module.exports.registration = (user) => {
  emailOptions.to = user.username;
  emailOptions.subject = 'Thank You for Signing Up!';
  emailOptions.html = `
	        <p><strong>Thank You for Signing Up!</strong></p>
	        <p>Very soon you'll be able to receive gifts from our site.</p>
	        <p>We are going to add your Alias to our Members listing on SendGiftHere.com and then, send you a confirmation E-mail.</p>
	        <p>Once added, tell your Friends & Admirers to use SendGiftHere.com to send you a gift.  Also, don’t forget to list SendGiftHere.com as your preferred wish list site.</p>
	        <p>When gifts are purchased to your Alias, an email will be sent and you will be given the option of either cash or a purchase.</p>
	        <p><strong>If you prefer cash,</strong> you'll receive up to 80% of the gift amount by check or PayPal. (We're adding direct deposit soon)</p>
	        <p><strong>If you would like a purchase,</strong> just send us the gift's URL, again, valued up to 80% of the gift amount, and we'll buy it and forward, using your profile address.</p>
	        <p>Again, we will send a separate email once you've been added and thank you for signing up!</p>
	        <p><strong>If you don't hear from us or don't see your name in the Member list when checking out on SendGiftHere.com within two business days, contact us immediately using the contact form on our site.</strong></p>
	        <p>Thanks Again for Signing Up!</p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
	        <p>Support Team</p>
	        <p>GiftCashing.com</p>
    	`;
  sendMail(emailOptions);
};
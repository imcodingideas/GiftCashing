/*jshint esversion: 6 */
'use strict';

const
  express = require('express'),
  _ = require('lodash'),
  router = express.Router({
    mergeParams: true
  }),
  passport = require('passport'),
  User = require('../models/user'),
  middleware = require('../middleware'),
  mailer = require('../mailer'),
  emailService = require('../services/email');

let locus = require('locus');

/* GET home page. */
router.get(
  '/',
  (req, res, next) => {
    res.render('index', {
      title: 'Gift Cashing'
    });
  });

// show register form
router.get(
  '/register',
  (req, res) => {
    res.render('register', {
      title: 'Register @ Gift Cashing'
    });
  });

// handle sign up logic
router.post(
  '/register',
  (req, res) => {
    
    let newUser = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      aliasFirstName: req.body.aliasFirstName,
      aliasLastName: req.body.aliasLastName,
      username: req.body.username
    });
    
    User
      .register(newUser, req.body.password, (err, user) => {
        
        if(err) {
          req.flash('error', err.message);
          res.redirect('back');
        }
        
        // Send the Welcome Email
        let welcomeEmail;
        welcomeEmail = `
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
        
        let emailOptions = {
          from: 'joseph@michael-chambers.com',
          to: newUser.username,
          subject: 'Thank You for Signing Up!',
          html: welcomeEmail
        };
        
        mailer
          .sendMail(emailOptions, (err, info) => {
            if(err) console.log('Mailing Error: ', err);
            console.log('mailing......................', info);
          });
        
        passport
          .authenticate('local')(req, res, () => {
            req.flash('success', 'Welcome to GiftCashing' + user.firstName);
            res.redirect('/dashboard/gifts?filter=received');
          });
        
      });
  });

// show login form
router.get(
  '/login',
  (req, res) => {
    res.render('login', {
      title: 'Login @ Gift Cashing'
    });
  });


router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }), (req, res) => {
    
    let user = {
      lastLoginDate: new Date()
    };
    
    //Update last login date
    User
      .findOneAndUpdate(
        {'username': req.user.username},
        user,
        (err, foundUser) => {
          if(err) {
            console.log('lastLoginDate error update: ', err);
          }
          /**
           * Are we saving this?
           */
          console.log('lastLoginDate success update');
        });
    
    if(req.user.isAdmin === true) {
      res.redirect('/admin/gifts?filter=review');
    }
    if(req.user.isAdmin === false) {
      res.redirect('/dashboard/gifts?filter=received');
    }
  });

// logout route
router.get(
  '/logout',
  (req, res) => {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/');
  });

router.get(
  '/admin/created-gift',
  middleware.isLoggedIn,
  (req, res, next) => {
    res.render('admin/created-gift/index', {
      title: 'Order Created',
      user: req.user,
      breadcrumbsName: 'Created Gift'
    })
  });

//Show forgot password
router.get(
  '/forgot-password',
  (req, res) => {
    res.render('forgot-password', {
      title: 'Forgot password @ Gift Cashing'
    });
  });

//process forgot password
router.post(
  '/forgot-password',
  (req, res) => {
    //generate random password
    let passwordString = Math.random().toString(36).slice(-10);
    
    User
      .findOne(
        {'username': req.body.email},
        (err, foundUser) => {
          if(err) {
            req.flash('error', 'Internal error');
            res.redirect('back');
          }
          if(foundUser) {
            foundUser.setPassword(
              passwordString,
              () => {
                foundUser.save(
                  (errSaving, resultSave) => {
                    if(errSaving) {
                      req.flash('error', errSaving.message);
                      res.redirect('back');
                    }
                    
                    emailService.sendForgotPassword(foundUser, passwordString);
                    req.flash('success', 'Please check your email.');
                    res.redirect('/login');
                  });
              });
          } else {
            req.flash('error', 'Cannot find a user by that email.');
            res.redirect('back');
          }
        });
  });

//Show how does it work
router.get(
  '/how-does-it-work',
  (req, res) => {
    res.render('how-does-it-work', {
      title: 'How does it work?',
      breadcrumbsName: 'How it works'
    });
  });

//Contact
router.post('/contact',
  (req, res) => {
    emailService.sendContact({
      email: req.body.sender_email,
      message: req.body.message_text
    });
    req.flash('success', 'Contact sent successfully');
    res.redirect('back');
  });

module.exports = router;
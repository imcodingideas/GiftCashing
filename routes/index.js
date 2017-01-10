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
  mailer = require('../mailer');

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

        if (err) {
          req.flash('error', err.message);
          res.redirect('back');
        }

        // Send the Welcome Email
        let welcomeEmail;
        welcomeEmail = `
	        <p>Dear ${newUser.firstName} ${newUser.lastName},</p>
	        <p>Thank you for registering with GiftCashing.com. We look forward to providing our services.</p>
	        <p>Start receiving cash for gifts. It’s simple and convenient.</p>
	        <p>To learn how, access your online account and view the "How it Works" page. If you have questions/concerns, contact us at support@giftcashing.com</p>
	        <p>Best Regards,<br/>
	        GiftCashing.com</p>
    	`;

        let emailOptions = {
          from: 'joseph@michael-chambers.com',
          to: newUser.username,
          subject: 'Welcome to GiftCashing.com',
          html: welcomeEmail
        };

        mailer
          .sendMail(emailOptions, (err, info) => {
            if (err) console.log('Mailing Error: ', err);
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
    if (req.user.isAdmin === true) {
      res.redirect('/admin/gifts?filter=review');
    }
    if (req.user.isAdmin === false) {
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

module.exports = router;
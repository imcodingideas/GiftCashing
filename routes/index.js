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
        
        emailService.registration(user);
        
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
      .findOne({'username': req.body.email})
      .then(foundUser => {
        foundUser.setPassword(
          passwordString,
          () => {
            foundUser.save(
              () => {
                emailService.sendForgotPassword(foundUser, passwordString);
                req.flash('success', 'Please check your email.');
                res.redirect('/login');
              });
          });
      })
      .catch(err => {
        if(err && err.message) req.flash('error', 'Cannot find a user by that email.');
        res.redirect('back');
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
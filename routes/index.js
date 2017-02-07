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

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', {
    title: 'Gift Cashing'
  });
});

// show register form
router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Register @ Gift Cashing'
  });
});

router.post('/register', (req, res) => {
  let data = _.pick(
    req.body,
    [
      'firstName',
      'lastName',
      'aliasFullName',
      'username'
    ]);
  let newUser = new User(data);
  
  registerUser(newUser, req.body.password)
    .then(user => {
      emailService.registration(user);
      passport.authenticate('local')(req, res, () => {
        req.flash('success', 'Welcome to GiftCashing ' + user.firstName);
        res.redirect('/dashboard/gifts?filter=received');
      });
    })
    .catch(err => {
      if(err.code === 11000) {
        req.flash('error', 'Sorry, Alias is already in use.');
        res.redirect('back');
      }
      req.flash('error', err.message);
      res.redirect('back');
    });
});

// show login form
router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login @ Gift Cashing'
  });
});

router.post(
  '/login',
  passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
  }),
  (req, res) => {
    let user = {
      lastLoginDate: new Date()
    };
    
    User.findOneAndUpdate({ username: req.user.username }, user)
        .then(foundUser => {
          if (foundUser.isAdmin === true) {
            res.redirect('/admin/gifts?filter=review');
          }
          if (foundUser.isAdmin === false) {
            res.redirect('/dashboard/gifts?filter=received');
          }
        })
        .catch(err => {
          if (err && err.message) req.flash('error', err.message);
        });
  }
);

// logout route
router.get('/logout', (req, res) => {
  req.logout();
  req.flash('success', 'Logged you out!');
  res.redirect('/');
});

router.get('/admin/created-gift', middleware.isLoggedIn, (req, res, next) => {
  res.render('admin/created-gift/index', {
    title: 'Order Created',
    user: req.user,
    breadcrumbsName: 'Created Gift'
  });
});

//Show forgot password
router.get('/forgot-password', (req, res) => {
  res.render('forgot-password', {
    title: 'Forgot password @ Gift Cashing'
  });
});

function generateRandomPassword() {
  return Math.random().toString( 36 ).slice( - 10 );
}

//process forgot password
router.post('/forgot-password', (req, res) => {
  let newPassword;
  let user;
  
  Promise.resolve()
         .then(() => User.findOne({ username: req.body.email }))
         .then(_user => {
           user = _user;
    
           newPassword = generateRandomPassword();
           return user.setPassword(newPassword);
         })
         .then(() => user.save())
         .then(() =>
           emailService.sendForgotPassword(user, newPassword).catch(error => {
             return Promise.reject(error);
           }))
         .then(() => {
           req.flash('success', 'Please check your email.');
           res.redirect('/login');
         })
         .catch(error => {
           if (error && error.message) req.flash('error', error.message);
           res.redirect('back');
         });
});

//Show how does it work
router.get('/how-does-it-work', (req, res) => {
  res.render('how-does-it-work', {
    title: 'How does it work?',
    breadcrumbsName: 'How it works'
  });
});

//Contact
router.post('/contact', (req, res) => {
  emailService.sendContact({
    email: req.body.sender_email,
    message: req.body.message_text
  });
  req.flash('success', 'Contact sent successfully');
  res.redirect('back');
});

function registerUser(newUser, password) {
  return new Promise((resolve, reject) => {
    User.register(
      newUser,
      password,
      (err, user) => {
        if(err) return reject(err);
        resolve(user);
      });
  });
}

module.exports = router;
const express = require('express'),
    router = express.Router({mergeParams: true}),
    passport = require('passport'),
    User = require('../models/user');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Gift Cashing' });
});

// show register form
router.get('/register', function (req, res) {
    res.render('register', { title: 'Register @ Gift Cashing' });
});

// handle sign up logic
router.post('/register', function (req, res) {
    var newUser = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        alaisFirstName: req.body.alaisFirstName,
        alaisLastName: req.body.alaisLastName,
        username: req.body.username
    });
    User.register(newUser, req.body.password, function (err, user) {

        if (err) {
            req.flash('error', err.message);
            return res.render('register', {title: 'Review Gifts'});
        }

        passport.authenticate('local')(req, res, function () {
            req.flash('success', 'Welcome to GiftCashing' + user.firstName);
            res.redirect('/users/' + user._id);
        });
    });
});

// show login form
router.get('/login', function (req, res) {
    res.render('login', { title: 'Login @ Gift Cashing' });
});

router.post('/login', passport.authenticate('local',
    {
        successRedirect: '/users',
        failureRedirect: '/login'
    }), function (req, res) {
});

// logout route
router.get('/logout', function (req, res) {
    req.logout();
    req.flash('success', 'Logged you out!');
    res.redirect('/');
});

module.exports = router;

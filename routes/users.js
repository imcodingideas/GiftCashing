const express = require('express'),
    router = express.Router({mergeParams: true});
    User = require('../models/user'),
    middleware = require('../middleware');

/* GET users listing. */
router.get('/', middleware.isLoggedIn, function (req, res, next) {

  // get all users from db
  User.find({}, function (err, allUsers) {
     if(err) {
         req.flash('error', err.message);
     } else {
         res.render('users/index', {user: allUsers, title: 'All Users', breadcrumbsName: 'All Users'});
     }
  });
});

// update user
router.put('/', middleware.isLoggedIn,  function (req, res, next) {
  //find and update correct user
  User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
    if(err) {
        req.flash('error', err.message);
    } else {
        res.redirect('/users/' + req.params.id, {user: updatedUser});
    }
  });
});

// shows more info about one user
router.get('/:id', middleware.isLoggedIn,  function (req, res) {
    //find the user with provided ID
    User.findById(req.params.id).populate('gifts').exec(function (err, foundUser) {
        if (err) {
            req.flash('error', err.message);
        } else {
            //render show template with that campground
            res.render('users/show', {user: foundUser, title: 'Profile', breadcrumbsName: 'Profile'});
        }
    });
});

// Edit User
router.get('/:id/edit', middleware.isLoggedIn, function (req, res, next) {
    User.findById(req.params.id, function (err, foundUser) {
        res.render('users/edit', {user: foundUser, title: 'Member Profile', breadcrumbsName: 'Member Profile'});
    });
});

// Update User
router.put('/:id', middleware.isLoggedIn, function (req, res, next) {
    //find and update correct campground
    User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
        if(err){
            req.flash('error', err.message);
        } else {
            //redirect show page
            res.redirect('/users/' + req.params.id);
        }
    });
});


module.exports = router;

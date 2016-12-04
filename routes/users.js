var express = require('express');
var User = require('../models/user');
var router = express.Router();

/* GET users listing. */
router.get('/', function (req, res, next) {

  // get all users from db
  User.find({}, function (err, allUsers) {
     if(err) {
       console.log(err)
     } else {
         console.log(allUsers);
         res.render('users/index', {users: allUsers, title: ''})
     }
  });
});

// update user
router.put('/', function (req, res, next) {
  //find and update correct user
  User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
    if(err) {
      res.redirect('/users');
    } else {
      res.redirect('/users/' + req.params.id);
    }
  });
});

// shows more info about one user
router.get('/:id', function (req, res) {
    //find the user with provided ID
    User.findById(req.params.id).populate('gifts').exec(function (err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            //render show template with that campground
            res.render('users/show', {user: foundUser, title: ''});
        }
    });
});

// Edit User
router.get('/:id/edit', function (req, res, next) {
    User.findById(req.params.id, function (err, foundUser) {
        res.render('users/edit', {user: foundUser, title: ''});
    });
});

// Update User
router.put('/:id', function (req, res, next) {
    //find and update correct campground
    User.findByIdAndUpdate(req.params.id, req.body.user, function (err, updatedUser) {
        if(err){
            res.redirect('/users');
        } else {
            //redirect show page
            res.redirect('/users/' + req.params.id);
        }
    });
});


module.exports = router;

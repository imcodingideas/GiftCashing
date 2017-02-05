/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  _ = require('lodash'),
  User = require('../models/user');

// Edit User
router.get('/:id/edit', (req, res) => {
  User.findById(req.params.id)
      .then(foundUser => {
        res.render('dashboard/profile/edit', {
          user: foundUser,
          title: 'Member Profile',
          breadcrumbsName: 'Profile'
        });
      })
      .catch(err => {
        if (err && err.message) req.flash('error', err.message);
      });
});

// Update User
router.put('/:id', (req, res) => {
  //Variables and params
  let user = req.body.user;
  let passwords = user.password;
  let finalPassword = '';
  
  //delete property on user
  delete user.password;
  
  //If exist passwords
  if (passwords && passwords[0] && passwords[1]) {
    //Password invalid
    if (!(passwords[0] === passwords[1] && passwords[0].length > 3)) {
      req.flash('error', 'Passwords do not match.');
      return res.redirect('back');
    }
    
    //set final password
    finalPassword = passwords[0];
  }
  
  //define is admin or non admin
  user.isAdmin = user.isAdmin === 'true' ? true : false;
  
  User.findByIdAndUpdate(req.params.id, user, (err, foundUser) => {
    if (err) {
      req.flash('error', err.message);
      return res.redirect('back');
    }
    
    //if exist final password
    if (finalPassword && finalPassword.length > 0) {
      //update password
      foundUser.setPassword(finalPassword, () => {
        foundUser.save((errSaving, resultSave) => {
          if (errSaving) {
            req.flash('error', errSaving.message);
            return res.redirect('back');
          }
          
          req.flash('success', 'Updated successfully.');
          return res.redirect('back');
        });
      });
    } else {
      req.flash('success', 'Updated successfully.');
      return res.redirect('back');
    }
  });
});

module.exports = router;
/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  _ = require('lodash'),
  User = require('../models/user'),
  middleware = require('../middleware');

// update user
router.put(
  '/',
  middleware.isLoggedIn,
  (req, res, next) => {
    //find and update correct user
    User
      .findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) => {
        if (err) {
          return req.flash('error', err.message);
        }

        res.redirect('/admin/users/' + req.params.id + '/edit', {
          user: updatedUser
        });
      });
  });

// Edit User
router.get(
  '/:id/edit',
  middleware.isLoggedIn,
  (req, res, next) => {

    User
      .findOne({_id: req.params.id}, (err, foundUser) => {
        if (err) {
          req.flash('error', err.message);
        }

        res.render('dashboard/profile/edit', {
          user: foundUser,
          title: 'Member Profile',
          breadcrumbsName: 'Member Profile'
        });
      });
  });

// Update User
router.put(
  '/:id',
  middleware.isLoggedIn,
  (req, res, next) => {
    let userData = req.body.user;

    //find and update user
    User
      .findByIdAndUpdate(
        req.params.id, userData,
        (err, updatedUser) => {

          if (err) {
            return req.flash('error', err.message);
          }

          //redirect show page
          res.redirect('/dashboard/profile/' + req.params.id + '/edit');
        });

  });

module.exports = router;
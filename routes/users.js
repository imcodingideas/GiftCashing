/*jshint esversion: 6 */
'use strict';
const express = require('express'),
  _ = require('lodash'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  locus = require('locus'),
  middleware = require('../middleware');

/* GET users listing. */
router.get('/admin/users', middleware.isLoggedIn, (req, res, next) => {
  let noMatch;

  if (req.query.search) {
    let fuzzy = new RegExp(req.query.search, 'gi');
    User
      .find({username: fuzzy},
        (err, allUsers) => {
          if (err) {
            req.flash('error', err.message);
          }
          if (allUsers.length < 1) {
            noMatch = 'No users were found based on that query ' + req.query.search;
          }

          res.render(
            'admin/users/index', {
              users: allUsers,
              title: 'Search Results',
              breadcrumbsName: 'Users',
              noMatch: noMatch
            });
        });
  }
  // get all users from db
  User
    .find({},
      (err, allUsers) => {
        if (err) {
          req.flash('error', err.message);
        }

        res.render(
          'admin/users/index', {
            users: allUsers,
            title: 'All Users',
            breadcrumbsName: 'Users',
            noMatch: noMatch
          });
      });
});

// update user
router.put(
  '/dashboard/profile/',
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
  '/dashboard/profile/:id/edit',
  middleware.isLoggedIn,
  (req, res, next) => {

    User
      .findOne({_id: req.params.id}, (err, foundUser) => {

        res.render('dashboard/profile/edit', {
          user: foundUser,
          title: 'Member Profile',
          breadcrumbsName: 'Member Profile'
        });
      });
  });

// Update User
router.put(
  '/dashboard/profile/:id',
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

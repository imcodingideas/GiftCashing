/*jshint esversion: 6 */
'use strict';
const express = require('express'),
  _ = require('lodash'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  Gift = require('../models/gift'),
  locus = require('locus'),
  middleware = require('../middleware');

/* GET users listing. */
router.get('/admin/users',
  middleware.isLoggedIn,
  (req, res, next) => {
    let query = {};

    switch (req.query.search) {
      default :
        query = {username: new RegExp(req.query.search, 'gi')};
        break;
    }

    User
      .find(query)
      .populate('gift')
      .exec((err, allUsers) => {
        if (err) {
          req.flash('error', err.message);
        }

        console.log(req.query)

        res.render(
          'admin/users/index', {
            users: allUsers,
            title: 'Users',
            breadcrumbsName: 'Users'
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

router.get(
  '/admin/users/:id/gifts',
  middleware.isLoggedIn,
  (req, res, next) => {

    const query = {
      user: req.params.id
    };

    Gift
      .find(query)
      .populate('user')
      .exec((err, gifts) => {
        if (err) {
          req.flash('error', err.message);
          gifts = [];
        }

        res.render('admin/users/gifts', {
          title: 'Received Gifts',
          breadcrumbsName: 'Gifts',
          gifts: gifts
        });
      });

  });

router.get(
  '/admin/users/:id/gifts/:gift_id',
  middleware.isLoggedIn,
  (req, res, next) => {

    Gift
      .findById(req.params.gift_id)
      .populate('user')
      .exec((err, foundGift) => {
        if (err) {
          req.flash('error', err.message);
        }

        console.log(foundGift);

        res.render('admin/gifts/show', {
          title: 'Received Gift',
          breadcrumbsName: 'Gift',
          foundGift: foundGift
        });
      });

  });

module.exports = router;

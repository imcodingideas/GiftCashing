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

        res.render(
          'admin/users/index', {
            users: allUsers,
            title: 'Users',
            breadcrumbsName: 'Users'
          });
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

        res.render('admin/gifts/show', {
          title: 'Received Gift',
          breadcrumbsName: 'Gift',
          foundGift: foundGift
        });
      });

  });

module.exports = router;

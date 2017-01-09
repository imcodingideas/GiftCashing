/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  Gift = require('../models/gift'),
  middleware = require('../middleware');

router.get(
  '/dashboard/gifts',
  middleware.isLoggedIn,
  (req, res) => {
    let query = {};

    switch (req.query.filter) {
      case 'received' :
        query = {
          user: req.user._id,
          'status.review': true
        };
        break;
      case 'declined' :
        query = {
          user: req.user._id,
          'status.declined': true
        };
        break;
      case 'pending' :
        query = {
          user: req.user._id,
          'status.pending': true
        };
        break;
      case 'paid' :
        query = {
          user: req.user._id,
          'status.paid': true
        };
        break;
    }

    Gift
      .find(query)
      .populate('user')
      .exec((err, gifts) => {
        if (err) {
          req.flash('error', err.message);
          gifts = [];
        }

        res.render('dashboard/gifts/index', {
          title: 'Received Gifts',
          breadcrumbsName: 'Received',
          gifts: gifts
        });
      });
  });


router.get(
  '/dashboard/share',
  middleware.isLoggedIn,
  (req, res) => {
    User
      .findOne({_id: req.user.id}, (err, user) => {
        if (err) {
          req.flash('error', err.message);
        }

        res.render('dashboard/share/index', {
          title: 'Share Gifts',
          breadcrumbsName: 'Share'
        });
        console.log(user)
      });
  });

module.exports = router;
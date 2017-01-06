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
  '/dashboard/received',
  middleware.isLoggedIn,
  (req, res) => {
    const query = {
      user: req.user._id,
      'status.review': false
    };

    Gift
      .find(query)
      .populate('user')
      .exec((err, gifts) => {
        if (err) {
          console.error(err);
          gifts = [];
        }

        res.render('dashboard/received/index', {
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
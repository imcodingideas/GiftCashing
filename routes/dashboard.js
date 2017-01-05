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

router.get('/', middleware.isLoggedIn, (req, res) => {
  Gift
    .find({})
    .populate('user')
    .exec(function (err, gifts) {
      if (err) {
        return res.status(500).send(err.message);
      }

      res.render('dashboard/received/index', {
        title: 'Received Gifts',
        gifts: gifts,
        breadcrumbsName: 'Received'
      });
    });
});

module.exports = router;
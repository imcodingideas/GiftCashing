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

router.get('/dashboard/received', middleware.isLoggedIn, (req, res) => {
  User
    .findOne({_id: req.user.id}, (err, user) => {
      if(err) {
        req.flash('error', err.message);
      }

      res.render('dashboard/received/index', {
        title: 'Received Gifts',
        breadcrumbsName: 'Received'
      });
      console.log(user)
  });
});

module.exports = router;
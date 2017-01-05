/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  middleware = require('../middleware');

router.get('/', middleware.isLoggedIn, (req, res) => {
  console.log(req.user)
  res.send('Hello');
});

module.exports = router;
/*jshint esversion: 6 */
const express = require('express'),
  _ = require('lodash');
router = express.Router({
  mergeParams: true
}),
  User = require('../models/user'),
  middleware = require('../middleware');

router.get('/', (req, res) => {
  req.query = _.pick(req.query, ['firstName', 'aliasFirstName']);

  let firstName;
  if (req.query.firstName) {
    firstName = {$regex: new RegExp(req.query.firstName, "ig")};
  }

  let aliasFirstName;
  if (req.query.aliasFirstName) {
    aliasFirstName = {$regex: new RegExp(req.query.aliasFirstName, "ig")};
  }

  if (!(aliasFirstName || firstName)) {
    return res.send();
  }

  if (!aliasFirstName) aliasFirstName = firstName;
  if (!firstName) firstName = aliasFirstName;

  let query = {
    $or: [
      {firstName},
      {aliasFirstName}
    ]
  };

  User.find(query).exec((err, foundUsers) => {
    if (!err) {
      res.send(foundUsers, {'Content-Type': 'application/json'}, 200);
    } else {
      res.send(JSON.stringify(err), {'Content-Type': 'application/json'}, 404)
    }
  });
});

module.exports = router;
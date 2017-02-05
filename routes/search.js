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

router.get('/', (req, res) => {
  
  // TODO: This search logic needs a refactor.
  // We should just receive generic query parameter and search that text in different fields,
  // instead a specific query parameter
  req.query = _.pick(req.query, ['firstName', 'aliasFirstName']);
  
  let firstName;
  if(req.query.firstName) {
    firstName = {$regex: new RegExp(req.query.firstName, 'ig')};
  }
  
  let aliasFirstName;
  if(req.query.aliasFirstName) {
    aliasFirstName = {$regex: new RegExp(req.query.aliasFirstName, 'ig')};
  }
  
  if(!(aliasFirstName || firstName)) {
    return res.send();
  }
  
  if(!aliasFirstName) aliasFirstName = firstName;
  if(!firstName) firstName = aliasFirstName;
  
  let query = {
    $or: [
      {firstName},
      {aliasFirstName}
    ]
  };
  
  User
    .find(query)
    .then(foundUsers => {
      let data = _.map(
        foundUsers, (item) => {
          return {
            // TODO: Specify the with data (normal name or alias) we should return here.
            value: item.aliasFirstName + ' ' + item.aliasLastName,
            id: item._id,
            profilePic: item.profilePic
          }
        });
      res.send(data, {'Content-Type': 'application/json'}, 200);
    })
    .catch(err => {
      res.send(JSON.stringify(err), {'Content-Type': 'application/json'}, 404);
    });
});

module.exports = router;
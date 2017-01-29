/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  Gift = require('../models/gift'),
  middleware = require('../middleware'),
  getPaginated = require('../components/getPaginated');

router.get(
  '/gifts',
  middleware.isLoggedIn,
  (req, res) => {
    let query = {};
    
    switch(req.query.filter) {
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
      case 'accepted-redeemed' :
        query = {
          user: req.user._id,
          'status.accepted': true
        };
        break;
      case 'paid' :
        query = {
          user: req.user._id,
          'status.paid': true
        };
        break;
    }
    
    getPaginated(Gift, 'user', query, req, result => {
      result.title ='Received Gifts';
      result.breadcrumbsName = 'Received';
      res.render('admin/gifts/index', result);
    });
  });


router.put(
  '/gifts/:id/:status',
  middleware.isLoggedIn,
  (req, res) => {
    let _id = req.params.id;
    let status = req.params.status;
    let message = req.body.message;
    Gift
      .findOne({
        _id,
        user: req.user._id
      })
      .exec((err, gift) => {
        if(err) {
          return res.status(500).send({
            success: false,
            err: err.message
          });
        }
        
        if(!gift) {
          return res.status(404).send({
            success: false,
            err: 'No gift found'
          });
        }
        
        for(let status in gift.status) {
          gift.status[status] = false;
        }
        gift.status[status] = true;
        
        Gift
          .update(
            {_id},
            {
              $set: {
                status: gift.status,
                giftMessage: message
              }
            },
            (err, result) => {
              if(err) {
                return res.status(500).send({
                  success: false,
                  err: err.message
                });
              }
              
              res.status(200).send({
                success: true,
                result
              });
            });
      });
  });


router.get(
  '/share',
  middleware.isLoggedIn,
  (req, res) => {
    User
      .findOne({_id: req.user.id}, (err, user) => {
        if(err) {
          req.flash('error', err.message);
        }
        
        res.render('dashboard/share/index', {
          title: 'Share Gifts',
          breadcrumbsName: 'Share'
        });
      });
  });

module.exports = router;
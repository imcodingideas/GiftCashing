/*jshint esversion: 6 */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  _ = require('lodash'),
  User = require('../models/user'),
  Gift = require('../models/gift'),
  middleware = require('../middleware');


/* GET Gifts page. */
router.get(
  '/',
  middleware.isLoggedIn,
  (req, res, next) => {
    let query = {'status.review': true};

    switch(req.query.filter) {
      case 'accepted-redeemed' :
        query = { 'status.accepted': { $not: { $gt: true } }};
        break;
      case 'accepted-not-redeemed' :
        query = { 'status.accepted': { $not: { $gt: false } }};
        break;
      case 'declined' :
        query = {'status.declined': true};
        break;
      case 'expired' :
        query = {'status.expired': true};
        break;
      case 'pending' :
        query = {'status.pending': true};
        break;
      case 'paid' :
        query = {'status.paid': true};
        break;
    }

    Gift
      .find(query)
      .populate('user')
      .exec(function (err, gifts) {
        if (err) {
          return res.status(500).send(err.message);
        }

        res.render('admin/gifts/index', {
          title: 'Review Gifts',
          gifts: gifts,
          breadcrumbsName: 'Gifts'
        });

      });

  });

// Create a Gift
router.post(
  '/',
  middleware.isLoggedIn,
  (req, res, next) => {

    // get data from form and add to gift array.
    let user = req.body.user,
      giftNumber = req.body.giftNumber,
      date = req.body.date,
      giftDescription = req.body.giftDescription,
      giftAmount = req.body.giftAmount,
      giftCode = req.body.giftCode,
      redeemCode = req.body.redeemCode,
      passCode = req.body.passCode,
      senderFirstName = req.body.senderFirstName,
      senderLastName = req.body.senderLastName,
      giftMessage = req.body.giftMessage,
      newGift = {
        user: user,
        giftNumber: giftNumber,
        date: date,
        giftDescription: giftDescription,
        giftAmount: giftAmount,
        giftCode: giftCode,
        redeemCode: redeemCode,
        passCode: passCode,
        senderFirstName: senderFirstName,
        senderLastName: senderLastName,
        giftMessage: giftMessage
      };

    Gift
      .create(newGift, (err, newlyCreated) => {
        if (err) {
          return res.status(500).send(err.message);
        }
        res.redirect('/admin/created-gift');
      });

  });

router.get(
  '/new',
  middleware.isLoggedIn,
  (req, res, next) => {
    res.render('admin/gifts/new', {
      title: 'New Gift',
      user: req.user,
      breadcrumbsName: 'Create Gift'
    })
  });

module.exports = router;
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
    let noMatch;

    if (Object.keys(req.query).length === 0) {
      res.redirect('/admin/gifts?filter=review');
    }
    if (req.query.filter === 'review') {
      Gift
        .find({'status.review': true})
        .populate('user')
        .exec(function (err, gifts) {
          if (err) {
            return res.status(500).send(err.message);
          }
          if (gifts.length < 1) {
            noMatch = 'No users were found based on that query';
          }

          res.render('admin/gifts/index', {
            title: 'Review Gifts',
            gifts: gifts,
            breadcrumbsName: 'Gifts',
            noMatch: noMatch
          });

        });
    }
    if (req.query.filter === 'accepted-redeemed') {
      Gift
        .find({'status.accepted': true})
        .populate('user')
        .exec(function (err, gifts) {
          if (err) {
            return res.status(500).send(err.message);
          }
          if (gifts.length < 1) {
            noMatch = 'No users were found based on that query';
          }

          res.render('admin/gifts/index', {
            title: 'Review Gifts',
            gifts: gifts,
            breadcrumbsName: 'Gifts',
            noMatch: noMatch
          });

        });
    }
    if (req.query.filter === 'accepted-not-redeemed') {
      Gift
        .find({'status.accepted': false})
        .populate('user')
        .exec(function (err, gifts) {
          if (err) {
            return res.status(500).send(err.message);
          }
          if (gifts.length < 1) {
            noMatch = 'No users were found based on that query';
          }

          res.render('admin/gifts/index', {
            title: 'Review Gifts',
            gifts: gifts,
            breadcrumbsName: 'Gifts',
            noMatch: noMatch
          });

        });
    }
    if (req.query.filter === 'declined') {
      Gift
        .find({'status.declined': true})
        .populate('user')
        .exec(function (err, gifts) {
          if (err) {
            return res.status(500).send(err.message);
          }
          if (gifts.length < 1) {
            noMatch = 'No users were found based on that query';
          }

          res.render('admin/gifts/index', {
            title: 'Review Gifts',
            gifts: gifts,
            breadcrumbsName: 'Gifts',
            noMatch: noMatch
          });

        });
    }
    if (req.query.filter === 'expired') {
      Gift
        .find({'status.expired': true})
        .populate('user')
        .exec(function (err, gifts) {
          if (err) {
            return res.status(500).send(err.message);
          }
          if (gifts.length < 1) {
            noMatch = 'No users were found based on that query';
          }

          res.render('admin/gifts/index', {
            title: 'Review Gifts',
            gifts: gifts,
            breadcrumbsName: 'Gifts',
            noMatch: noMatch
          });

        });
    }
    if (req.query.filter === 'pending') {
      Gift
        .find({'status.pending': true})
        .populate('user')
        .exec(function (err, gifts) {
          if (err) {
            return res.status(500).send(err.message);
          }
          if (gifts.length < 1) {
            noMatch = 'No users were found based on that query';
          }

          res.render('admin/gifts/index', {
            title: 'Review Gifts',
            gifts: gifts,
            breadcrumbsName: 'Gifts',
            noMatch: noMatch
          });

        });
    }
    if (req.query.filter === 'paid') {
      Gift
        .find({'status.paid': true})
        .populate('user')
        .exec(function (err, gifts) {
          if (err) {
            return res.status(500).send(err.message);
          }
          if (gifts.length < 1) {
            noMatch = 'No users were found based on that query';
          }

          res.render('admin/gifts/index', {
            title: 'Review Gifts',
            gifts: gifts,
            breadcrumbsName: 'Gifts',
            noMatch: noMatch
          });

        });
    }

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
        res.redirect('/admin/gifts');
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
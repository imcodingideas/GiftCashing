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
  middleware = require('../middleware'),
  async = require('async'),
  getPaginated = require('../components/getPaginated');

const excel = require('../components/excel');

/* GET Gifts page. */
router.get(
  '/',
  middleware.isLoggedIn,
  (req, res) => {
    
    let query = {'status.review': true};
    
    switch(req.query.filter) {
      case 'accepted-redeemed' :
        query = {'status.accepted': true};
        break;
      case 'declined' :
        query = {'status.declined': true};
        break;
      case 'pending' :
        query = {'status.pending': true};
        break;
      case 'paid' :
        query = {'status.paid': true};
        break;
    }
    
    getPaginated(Gift, 'user', query, req, result => {
      result.title = 'Review Gifts';
      result.breadcrumbsName = 'Gifts';
      res.render('admin/gifts/index', result);
    });
  });

// Create a Gift
router.post(
  '/',
  middleware.isLoggedIn,
  (req, res) => {
    
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
        if(err) {
          req.flash('error', err.message);
        }
        
        if(!err) {
          User.findByIdAndUpdate(
            user, {
              $push: {
                gifts: newlyCreated._id
              }
            },
            (err, result) => {
              if(err) {
                req.flash('error', err.message);
              }
              
              res.redirect('/admin/created-gift');
            })
        }
      });
    
  });

router.get(
  '/new',
  middleware.isLoggedIn,
  (req, res) => {
    res.render('admin/gifts/new', {
      title: 'New Gift',
      user: req.user,
      breadcrumbsName: 'Create Gift'
    });
  });


/* PUT Gifts page. */
function updateGiftStatus(gift, done) {
  let id = gift._id;
  gift.changedStatusDate = new Date();
  
  gift = _.pick(gift, ['status', 'changedStatusDate']);
  for(let s in gift.status) {
    gift.status[s] = (gift.status[s] === 'true' || gift.status[s] === true);
  }
  
  //find gift for update
  Gift
    .findByIdAndUpdate(
      id,
      gift,
      (err) => {
        if(err) {
          done(`Error updating the Gift: ${gift._id}`);
        }
        done(null, 'Gift success update.');
      });
}
router.put(
  '/',
  middleware.isLoggedIn,
  (req, res) => {
    
    if(
      !_.isArray(req.body.gifts)
      || _.isEmpty(req.body.gifts)
    ) {
      return res.send({
        success: true
      });
    }
    
    async.each(
      req.body.gifts,
      updateGiftStatus,
      (err) => {
        if(err) {
          console.log('err async each: ', err);
          return res.status(500).send({
            success: false,
            message: 'Error, contact support'
          });
        }
        
        return res.send({
          success: true,
          message: 'Update success'
        });
      });
  });


/* Export to excel report*/
router.post(
  '/excel-report',
  (req, res) => {
    let report = excel.generateGifts(req.body.gifts || []);
    res.attachment('report.xlsx');
    return res.status(200).send(report);
  });
module.exports = router;
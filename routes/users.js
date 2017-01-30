/*jshint esversion: 6 */
'use strict';
const express = require('express'),
  _ = require('lodash'),
  router = express.Router({
    mergeParams: true
  }),
  User = require('../models/user'),
  Gift = require('../models/gift'),
  locus = require('locus'),
  middleware = require('../middleware'),
  excel = require('../components/excel'),
  getPaginated = require('../components/getPaginated');

/* GET users listing. */
router.get('/',
  middleware.isLoggedIn,
  (req, res) => {
    let query = {};
    
    switch(req.query.search) {
      default :
        query = {username: new RegExp(req.query.search, 'gi')};
        break;
    }
    
    getPaginated(User, 'gifts', query, req, result => {
      result.title = 'Members';
      result.breadcrumbsName = 'Members';
      result.items = result.items.map(user => {
        user.totalAmountOfGifts = 0;
        if(user.gifts.length > 0) {
          for(let gift of user.gifts) {
            user.totalAmountOfGifts += gift.giftAmount;
          }
        }
        return user;
      });
      res.render('admin/users/index', result);
    });
  });


router.get(
  '/:id/gifts',
  middleware.isLoggedIn,
  (req, res) => {
    
    const query = {
      user: req.params.id
    };
    
    getPaginated(Gift, 'user', query, req, result => {
      result.user = (result.items.length > 0) ? result.items[0].user : {_id: query.user};
      result.title = 'Review Gifts';
      result.breadcrumbsName = 'Gifts';
      res.render('admin/users/gifts', result);
    });
  });

router.get(
  '/:id/gifts/:gift_id',
  middleware.isLoggedIn,
  (req, res) => {
    
    User.findById(req.params.id, (err, user) => {
      let pagination = {
        page: 1,
        perPage: 1,
        pages: user.gifts.length,
        showing: 1,
        records: user.gifts.length,
        previousGiftId: req.params.gift_id,
        nextGiftId: req.params.gift_id
      };
      
      let giftIds = user.gifts;
      if(giftIds.length > 1) {
        for(let i = 0; i < giftIds.length; i++) {
          if(giftIds[i] == req.params.gift_id) {
            if(i > 0) pagination.previousGiftId = giftIds[i - 1];
            if(i < giftIds.length - 1) pagination.nextGiftId = giftIds[i + 1];
            pagination.showing = i + 1;
            break;
          }
        }
      }
      
      Gift
        .findById(req.params.gift_id)
        .populate('user')
        .exec((err, foundGift) => {
          if(err) {
            req.flash('error', err.message);
          }
          
          res.render('admin/gifts/show', {
            title: 'Received Gift',
            breadcrumbsName: 'Gift',
            foundGift: foundGift,
            pagination
          });
        });
    });
  });

/**
 * Delete a Gift
 * @param  {Id of Gift} giftId
 * @param  {Response} res
 */
function deleteGift(giftId, res) {
  Gift.remove({_id: giftId}, (err) => {
    if(!err) {
      return res.send({
        success: true,
        message: 'Delete success'
      });
    } else {
      return res.status(500).send({
        success: false,
        message: 'Error, contact support'
      });
    }
  });
}

/* Update Gift listing. */
router.put(
  '/:id/gifts/:gift_id',
  (req, res) => {
    
    let status = {
      'paid': false,
      'declined': false,
      'redeemed': false,
      'accepted': false,
      'review': false
    };
    
    switch(req.body.action || '') {
      case 'accepted':
        status['accepted'] = true;
        break;
      case 'declined':
        status['declined'] = true;
        break;
      case 'paid':
        status['paid'] = true;
        break;
      case 'delete':
        return deleteGift(req.params.gift_id || '', res);
        break;
      default:
        return res.status(500).send({
          success: false,
          message: 'Error, contact support'
        });
    }
    ;
    
    let gift = {
      status: status
    };
    
    //Update status gift
    Gift.findOneAndUpdate(
      {'_id': req.params.gift_id || ''},
      gift,
      (err, foundGift) => {
        if(!err) {
          return res.send({
            success: true,
            message: 'Update success'
          });
        } else {
          return res.status(500).send({
            success: false,
            message: 'Error, contact support'
          });
        }
      });
    
  });

/*Gift specific to excel report*/
router.get('/excel-gift/:gift_id',
  (req, res) => {
    Gift
      .findById(
        req.params.gift_id || '',
        (err, gift) => {
          if(err) {
            return res.status(500).send({
              success: false,
              message: 'Error, contact support'
            });
          } else {
            //dataset for report excel
            let gifts = [];
            gifts.push(gift);
            //Call function to generate the excel
            let report = excel.generateGifts(gifts);
            res.attachment('report.xlsx');
            return res.status(200).send(report);
          }
        });
  });

/* Export to excel report*/
router.post('/excel-report',
  (req, res) => {
    let report = excel.generateUsers(req.body.users || []);
    res.attachment('report.xlsx');
    return res.status(200).send(report);
  });

module.exports = router;
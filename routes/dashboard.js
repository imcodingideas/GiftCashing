/* jslint node: true */

const express = require('express')

const router = express.Router({
  mergeParams: true,
})

const _ = require('lodash')
const User = require('../models/user')

const Gift = require('../models/gift')

router.get('/gifts', (req, res) => {
  let query = {}

  switch (req.query.filter) {
    case 'received':
      query = {
        user: req.user._id,
        'status.review': true,
      }
      break
    case 'declined':
      query = {
        user: req.user._id,
        'status.declined': true,
      }
      break
    case 'accepted':
      query = {
        user: req.user._id,
        'status.accepted': true,
      }
      break
    case 'paid':
      query = {
        user: req.user._id,
        'status.paid': true,
      }
      break
  }

  Gift.find(query)
    .populate('user')
    .then(gifts => {
      if (req.query.filter === 'received') {
        res.render('dashboard/gifts/index', {
          title: 'Received Gifts',
          breadcrumbsName: 'Received',
          gifts,
        })
      }

      if (['accepted', 'declined', 'paid'].indexOf(req.query.filter) > -1) {
        res.render('dashboard/gifts/other', {
          title: req.query.filter,
          breadcrumbsName: req.query.filter,
          gifts,
        })
      }
    })
    .catch(err => {
      if (err && err.message) {
        req.flash('error', err.message)
        gifts = []
      }
    })
})

router.put('/gifts/:id/:status', (req, res) => {
  const _id = req.params.id
  const status = req.params.status
  const message = req.body.message

  if (_.trim(req.user.preferredPaymentMethod) == '') {
    return res.send({
      success: false,
      error: 'Please set your preferred payment method.',
    })
  }
  Gift.findOne({ _id, user: req.user._id })
    .then(gift => {
      if (!gift) {
        return res.status(404).send({
          success: false,
          err: 'No gift found',
        })
      }

      for (const status in gift.status) {
        gift.status[status] = false
      }
      gift.status[status] = true

      Gift.update(
        { _id },
        {
          $set: {
            status: gift.status,
            changedStatusDate: new Date(),
            acceptedGiftMessage: message,
          },
        }
      )
        .then(result => {
          res.status(200).send({
            success: true,
            result,
          })
        })
        .catch(err =>
          res.status(500).send({
            success: false,
            err: err.message,
          })
        )
    })
    .catch(err => {
      if (err) {
        req.flash('error', err.message)
        req.redirect('back')
      }
    })
})

router.get('/share', (req, res) => {
  User.findOne({ _id: req.user.id })
    .then(user => {
      res.render('dashboard/share/index', {
        title: 'Share Gifts',
        breadcrumbsName: 'Share',
      })
    })
    .catch(err => {
      if (err && err.message) req.flash('error', err.message)
    })
})

router.put('/gift/declined/:gift_id', (req, res) => {
  const status = {
    paid: false,
    declined: true,
    redeemed: false,
    accepted: false,
    review: false,
  }

  const set = {
    status,
    changedStatusDate: new Date(),
  }

  Gift.findById(req.params.gift_id)
    .then(record => {
      record = Object.assign(record, set)
      return record.save()
    })
    .then(updatedRecord => {
      let message = 'Could not find and modify gift.'

      let success = false
      if (updatedRecord && updatedRecord.status.declined == true) {
        message = 'Gift has been declined successfully.'
        success = true
      }
      res.send({
        success,
        message,
        gift: updatedRecord,
      })
    })
    .catch(err => {
      console.log('Error:', err)
      return res.send({
        success: false,
        error: 'Error, contact support',
      })
    })
})

module.exports = router

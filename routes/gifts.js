/* jshint esversion: 6 */

const express = require('express')

const router = express.Router({
  mergeParams: true,
})

const _ = require('lodash')

const moment = require('moment')

const async = require('async')
const User = require('../models/user')

const Gift = require('../models/gift')

const getPaginated = require('../components/getPaginated')

const excel = require('../components/excel')

/* GET Gifts page. */
router.get('/', (req, res) => {
  let query = { 'status.review': true }

  switch (req.query.filter) {
    case 'accepted':
      query = { 'status.accepted': true }
      break
    case 'declined':
      query = { 'status.declined': true }
      break
    case 'pending':
      query = { 'status.pending': true }
      break
    case 'paid':
      query = { 'status.paid': true }
      break
  }

  getPaginated(Gift, 'user', query, req).then(result => {
    result.title = 'Review Gifts'
    result.breadcrumbsName = 'Gifts'
    res.render('admin/gifts/index', result)
  })
})

// Create a Gift
router.post('/', (req, res) => {
  // get data from form and add to gift array.

  // TODO: refactor
  const user = req.body.user

  const giftNumber = req.body.giftNumber

  const date = req.body.date

  const giftDescription = req.body.giftDescription

  const giftAmount = req.body.giftAmount

  const giftCode = req.body.giftCode

  const redeemCode = req.body.redeemCode

  const passCode = req.body.passCode

  const senderFirstName = req.body.senderFirstName

  const senderLastName = req.body.senderLastName

  const giftMessage = req.body.giftMessage

  const newGift = {
    user,
    giftNumber,
    date,
    giftDescription,
    giftAmount,
    giftCode,
    redeemCode,
    passCode,
    senderFirstName,
    senderLastName,
    giftMessage,
  }

  Gift.create(newGift)
    .then(newlyCreated => {
      User.findByIdAndUpdate(user, { $push: { gifts: newlyCreated._id } })
        .then(() => {
          res.redirect('/admin/created-gift')
        })
        .catch(err => {
          if (err && err.message) req.flash('error', err.message)
        })
    })
    .catch(err => {
      if (err && err.message) req.flash('error', err.message)
    })
})

router.get('/new', (req, res) => {
  res.render('admin/gifts/new', {
    title: 'New Gift',
    user: req.user,
    breadcrumbsName: 'Create Gift',
  })
})

/* PUT Gifts page. */
function updateGiftStatus(gift, done) {
  const id = gift._id
  gift.changedStatusDate = new Date()

  gift = _.pick(gift, ['status', 'changedStatusDate'])
  for (const s in gift.status) {
    gift.status[s] = gift.status[s] === 'true' || gift.status[s] === true
  }

  Gift.findByIdAndUpdate(id, gift)
    .then(updatedGift => {
      done(null, 'Gift success update.')
    })
    .catch(err => {
      if (err && err.message) req.flash('error', err.message)
    })
}

router.put('/', (req, res) => {
  if (!_.isArray(req.body.gifts) || _.isEmpty(req.body.gifts)) {
    return res.send({
      success: true,
    })
  }

  async.each(req.body.gifts, updateGiftStatus, err => {
    if (err) {
      console.log('err async each: ', err)
      return res.status(500).send({
        success: false,
        message: 'Error, contact support',
      })
    }

    return res.send({
      success: true,
      message: 'Update success',
    })
  })
})

function buildQuery(req) {
  const query = {}

  if (req.query.filter) {
    query[`status.${req.query.filter}`] = true
  }

  const dateCondition = {}

  const dateFrom = new moment(req.query.datefrom)
  if (dateFrom.isValid()) {
    dateCondition.$gte = `${dateFrom.format('YYYY-MM-DD')}T00:00:00.000Z`
  }

  const dateTo = new moment(req.query.dateto)
  if (dateTo.isValid()) {
    dateCondition.$lt = `${dateTo
      .add(1, 'day')
      .format('YYYY-MM-DD')}T00:00:00.000Z`
  }

  if (dateCondition) {
    query.$or = [{ date: dateCondition }, { changedStatusDate: dateCondition }]
  }
  console.log(query.$or, query)
  return query
}
router.get('/filter', (req, res) => {
  getPaginated(Gift, 'user', buildQuery(req), req).then(result => {
    result.title = 'Filtered Gifts'
    result.breadcrumbsName = 'Gifts'
    res.render('admin/gifts/index', result)
  })
})

/* Export to excel report */
router.post('/excel-report', (req, res) => {
  const report = excel.generateGifts(req.body.gifts || [])
  res.attachment('report.xlsx')
  return res.status(200).send(report)
})

module.exports = router

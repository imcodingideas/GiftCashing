/* jshint esversion: 6 */

const express = require('express')

const _ = require('lodash')

const router = express.Router({
  mergeParams: true,
})

const User = require('../models/user')

const Gift = require('../models/gift')

const excel = require('../components/excel')

const getPaginated = require('../components/getPaginated')

/* GET users listing. */
router.get('/', (req, res) => {
  let query = {}

  switch (req.query.search) {
    default:
      query = { username: new RegExp(req.query.search, 'gi') }
      break
  }
  query.isAdmin = false

  getPaginated(User, 'gifts', query, req).then(result => {
    result.title = 'Members'
    result.breadcrumbsName = 'Members'
    result.items = result.items.map(user => {
      user.totalAmountOfGifts = 0
      if (user.gifts.length > 0) {
        for (const gift of user.gifts) {
          user.totalAmountOfGifts += gift.giftAmount
        }
      }
      return user
    })
    res.render('admin/users/index', result)
  })
})

router.get('/:id/gifts', (req, res) => {
  const query = {
    user: req.params.id,
  }

  getPaginated(Gift, 'user', query, req).then(result => {
    result.user =
      result.items.length > 0 ? result.items[0].user : { _id: query.user }
    result.title = 'Review Gifts'
    result.breadcrumbsName = 'Gifts'
    res.render('admin/users/gifts', result)
  })
})

router.get('/:id/gifts/:gift_id', (req, res) => {
  User.findById(req.params.id, (err, user) => {
    const pagination = {
      page: 1,
      perPage: 1,
      pages: user.gifts.length,
      showing: 1,
      records: user.gifts.length,
      previousGiftId: req.params.gift_id,
      nextGiftId: req.params.gift_id,
    }

    const giftIds = user.gifts
    if (giftIds.length > 1) {
      for (let i = 0; i < giftIds.length; i++) {
        if (giftIds[i] == req.params.gift_id) {
          if (i > 0) pagination.previousGiftId = giftIds[i - 1]
          if (i < giftIds.length - 1) pagination.nextGiftId = giftIds[i + 1]
          pagination.showing = i + 1
          break
        }
      }
    }

    Gift.findById(req.params.gift_id)
      .populate('user')
      .then(foundGift => {
        if (!foundGift) {
          res.redirect(`/admin/users/${req.params.id}/gifts`)
          return
        }
        res.render('admin/gifts/show', {
          title: 'Received Gift',
          breadcrumbsName: 'Gift',
          foundGift,
          pagination,
        })
      })
      .catch(err => {
        if (err && err.message) req.flash('error', err.message)
      })
  })
})

function normalUpdateGift(giftId, gift, res) {
  Gift.findByIdAndUpdate(giftId, gift)
    .then(() =>
      res.status(200).send({
        success: true,
        message: 'Update success',
        normal: true,
      })
    )
    .catch(err =>
      res.status(500).send({
        success: false,
        message: 'Error, contact support',
      })
    )
}

function deleteGift(giftId, res) {
  Gift.remove({ _id: giftId })
    .then(() =>
      res.send({
        success: true,
        message: 'Delete success',
        gift: {
          status: { deleted: true },
        },
      })
    )
    .catch(err =>
      res.send({
        success: false,
        message: 'Error, contact support',
      })
    )
}

/* Update Gift listing. */
router.put('/:id/gifts/:gift_id', (req, res) => {
  const status = {
    paid: false,
    declined: false,
    redeemed: false,
    accepted: false,
    review: false,
  }

  switch (req.body.action || '') {
    case 'review':
    case 'accepted':
    case 'declined':
    case 'paid':
      status[req.body.action] = true
      break

    case 'delete':
      return deleteGift(req.params.gift_id || '', res)
      break

    case 'normal':
      const gift = req.body.foundGift || {}
      return normalUpdateGift(req.params.gift_id || '', gift, res)
      break

    default:
      return res.send({
        success: false,
        message: 'Error, contact support',
      })
  }

  const set = {
    status,
    changedStatusDate: new Date(),
  }

  // Update status gift
  Gift.findById(req.params.gift_id)
    .then(record => {
      record = Object.assign(record, set)
      return record.save()
    })
    .then(updatedRecord => {
      let message = 'Could not find and modify gift.'

      let success = false
      if (updatedRecord && updatedRecord.status[req.body.action] == true) {
        message = 'Gift status has been modified successfully.'
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

/* Gift specific to excel report */
router.get('/excel-gift/:gift_id', (req, res) => {
  Gift.findById(req.params.gift_id || '')
    .then(gift => {
      const gifts = []
      gifts.push(gift)
      // Call function to generate the excel
      const report = excel.generateGifts(gifts)

      res.attachment('report.xlsx')
      return res.status(200).send(report)
    })
    .catch(err =>
      res.status(500).send({
        success: false,
        message: 'Error, contact support',
      })
    )
})

/* Export to excel report */
router.post('/excel-report', (req, res) => {
  const report = excel.generateUsers(req.body.users || [])
  res.attachment('report.xlsx')
  return res.status(200).send(report)
})

module.exports = router

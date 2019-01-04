/* jshint esversion: 6 */

const express = require('express')

const router = express.Router({
  mergeParams: true,
})

const User = require('../models/user')

const getPaginated = require('../components/getPaginated')

/* GET admins listing. */
router.get('/', (req, res) => {
  const query = { isAdmin: true }

  getPaginated(User, 'gifts', query, req).then(result => {
    result.title = 'Admins'
    result.breadcrumbsName = 'Admins'
    result.items = result.items.map(user => {
      user.totalAmountOfGifts = 0
      if (user.gifts.length > 0) {
        for (const gift of user.gifts) {
          user.totalAmountOfGifts += gift.giftAmount
        }
      }
      return user
    })
    res.render('admin/admins/index', result)
  })
})

module.exports = router

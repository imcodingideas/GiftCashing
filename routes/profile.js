/* jslint node: true */

const express = require('express')

const router = express.Router({
  mergeParams: true,
})

const _ = require('lodash')

const User = require('../models/user')

// Edit User
router.get('/:id/edit', (req, res) => {
  User.findById(req.params.id)
    .then(foundUser => {
      res.render('dashboard/profile/edit', {
        user: foundUser,
        title: 'Member Profile',
        breadcrumbsName: 'Profile',
      })
    })
    .catch(err => {
      if (err && err.message) req.flash('error', err.message)
    })
})

// Update User
router.put('/:id', (req, res) => {
  if (req.user._id != req.params.id && !req.user.isAdmin) {
    return res.redirect('back')
  }

  // Variables and params
  const data = req.body.user
  const passwords = data.password
  let finalPassword = ''

  // delete property on user
  delete data.password

  // If exist passwords
  if (passwords && passwords[0] && passwords[1]) {
    // Password invalid
    if (!(passwords[0] === passwords[1] && passwords[0].length > 3)) {
      req.flash('error', 'Passwords do not match.')
      return res.redirect('back')
    }

    // set final password
    finalPassword = passwords[0]
  }

  // define is admin or non admin
  data.isAdmin = req.user.isAdmin ? data.isAdmin === 'true' : false

  const setPassword = (user, password) =>
    new Promise((resolve, reject) => {
      if (!password) return resolve(user)

      user.setPassword(password, () => {
        user.save((err, result) => {
          if (err) return reject(err)
          resolve(result)
        })
      })
    })

  User.findById(req.params.id)
    .then(user => _.assign(user, data).save()) // update user record
    .then(user => setPassword(user, finalPassword)) // set password
    .then(() => {
      req.flash('success', 'Updated successfully.')
      return res.redirect('back')
    })
    .catch(err => {
      req.flash('error', err.message)
      return res.redirect('back')
    })
})

module.exports = router

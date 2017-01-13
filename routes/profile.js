/*jslint node: true */
'use strict';

const
  express = require('express'),
  router = express.Router({
    mergeParams: true
  }),
  _ = require('lodash'),
  User = require('../models/user'),
  multer = require('multer'),
  middleware = require('../middleware');

const storage = multer.diskStorage({
    destination: function (req, file, callback) {
      callback(null, './uploads');
    },
    filename: function (req, file, callback) {
      callback(null, req.params.id + file.originalname);
    }
  }),
  upload = multer({storage: storage});

// Edit User
router.get(
  '/:id/edit',
  middleware.isLoggedIn,
  (req, res, next) => {

    User
      .findOne({_id: req.params.id}, (err, foundUser) => {
        if (err) {
          req.flash('error', err.message);
        }

        res.render('dashboard/profile/edit', {
          user: foundUser,
          title: 'Member Profile',
          breadcrumbsName: 'Member Profile'
        });
      });
  });

// Update User
router.put(
  '/:id',
  middleware.isLoggedIn,
  upload.single('pic'),
  (req, res, next) => {
    //find and update user
    User
      .findByIdAndUpdate(
        req.params.id, req.body.user,
        (err, updatedUser) => {

          if (err) {
            return req.flash('error', err.message);
          }

          //redirect show page
          res.redirect('/dashboard/profile/' + req.params.id + '/edit');
        });

  });

module.exports = router;
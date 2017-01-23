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
    destination: function(req, file, callback) {
      callback(null, './uploads');
    },
    filename: function(req, file, callback) {
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
        if(err) {
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
  (req, res) => {
    
    let user = req.body.user;
    let passwords = user.password;
    
    if(passwords && passwords[0] && passwords[1]) {
      if(!((passwords[0] === passwords[1]) && passwords[0].length > 3)) {
        req.flash('error', 'Passwords do not match.');
        return res.redirect('back');
      }
      
      user.password = passwords[0];
    } else {
      delete user.password;
    }      

    //define is admin or non admin 
    user.isAdmin = (user.isAdmin) === 'true' ? true : false;

    User
      .findByIdAndUpdate(
        req.params.id,
        user,
        (err) => {
          if(err) {
            req.flash('error', err.message);
            return res.redirect('back');
          }
          
          req.flash('success', 'Updated successfully.');
          res.redirect('back');
        });
  });

module.exports = router;
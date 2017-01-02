/*jshint esversion: 6 */
const express = require('express'),
  router = express.Router({
    mergeParams: true
  });
User = require('../models/user'),
  middleware = require('../middleware');

let locus = require('locus');

/* GET users listing. */
router.get('/', middleware.isLoggedIn, (req, res, next) =>{
  let noMatch;

  if(req.query.search) {
    let fuzzy = new RegExp(escapeRegex(req.query.search), 'gi');
    User.find({username: fuzzy}, (err, allUsers) =>{
        if (err) {
            req.flash('error', err.message);
        } else {
          if(allUsers.length < 1) {
            noMatch = 'No users were found based on that query ' + req.query.search;
          }
          res.render('users/index', {
              users: allUsers,
              title: 'Search Results',
              breadcrumbsName: 'Users',
              noMatch: noMatch
          });
        }
    });
  } else {
    // get all users from db
    User.find({}, (err, allUsers) =>{
        if (err) {
            req.flash('error', err.message);
        } else {
            res.render('users/index', {
                users: allUsers,
                title: 'All Users',
                breadcrumbsName: 'Users',
                noMatch: noMatch
            });
        }
    });
  }
});

// update user
router.put('/', middleware.isLoggedIn, (req, res, next) =>{
    //find and update correct user
    User.findByIdAndUpdate(req.params.id, req.body.user, (err, updatedUser) =>{
        if (err) {
            req.flash('error', err.message);
        } else {
            res.redirect('/users/' + req.params.id + '/edit' , {
                user: updatedUser
            });
        }
    });
});

// Edit User
router.get('/:id/edit', middleware.isLoggedIn, (req, res, next) =>{
    User
    .findOne({_id: req.params.id}, (err, foundUser) =>{
    	console.log(foundUser)
        res.render('users/edit', {
            user: foundUser,
            title: 'Member Profile',
            breadcrumbsName: 'Member Profile'
        });
    });
});

// Update User
router.put('/:id', middleware.isLoggedIn, (req, res, next) =>{
	let userData = req.body.user;

	//find and update user
	User.findByIdAndUpdate(req.params.id, userData, (err, updatedUser) =>{
		if (err) {
			req.flash('error', err.message);
		} else {
			//redirect show page
			res.redirect('/users/' + req.params.id + '/edit');
		}
	});

});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = router;

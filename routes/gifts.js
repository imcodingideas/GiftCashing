/*jshint esversion: 6 */
const express = require('express'),
	router = express.Router({
		mergeParams: true
	}),
	User = require('../models/user'),
	Gift = require('../models/gift'),
	middleware = require('../middleware');

/* GET Gifts page. */
router.get('/', middleware.isLoggedIn, (req, res, next) =>{

	User.find({}, function(err, allUsers) {
		if (err) {
			req.flash('error', err.message);
		} else {
			// console.log(user);
			res.render('gifts/index', {
				title: 'Review Gifts',
				users: allUsers,
				breadcrumbsName: 'Gifts'
			});
		}
	});
});

// Create a Gift
router.post('/', middleware.isLoggedIn, (req, res, next) =>{

	// get data from form and add to gift array.
	let username = req.body.username,
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
			username: username,
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


	Gift.create(req.body.id, newGift, (err, newlyCreated) =>{
		if (err) {
			req.flash('error', err.message);
		} else {
			console.log(newlyCreated);
			res.redirect('/gifts');
		}
	});

});

router.get('/new', middleware.isLoggedIn, (req, res, next) =>{
	res.render('gifts/new', {
		title: 'New Gift',
		user: req.user,
		breadcrumbsName: 'Create Gift'
	})
});


module.exports = router;
const express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    Gift = require('../models/gift'),
    middleware = require('../middleware');


router.get('/new', middleware.isLoggedIn, function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if(err) {
            req.flash('error', err.message);
        } else {
            res.render('gifts/new', { title: 'New Gift', user: user, breadcrumbsName: 'Create Gift'})
        }
    });
});

/* GET Gifts page. */
router.get('/', middleware.isLoggedIn, function(req, res, next) {
    User.find({}, function (err, allUsers) {
       if(err) {
           req.flash('error', err.message);
       } else {
           console.log(req.body);
           res.render('gifts', { title: 'Review Gifts', user: allUsers, breadcrumbsName: 'Hello'});
       }
    });
});

// Create a Gift
router.post('/', middleware.isLoggedIn, function(req, res, next) {
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
        newGift = { username: username, giftNumber: giftNumber, date: date, giftDescription: giftDescription, giftAmount: giftAmount, giftCode: giftCode, redeemCode: giftCode, redeemCode: redeemCode, passCode: passCode, senderFirstName: senderFirstName, senderLastName: senderLastName, giftMessage: giftMessage };


    Gift.create(req.body.id, newGift, function (err, newlyCreated) {
        if(err) {
            req.flash('error', err.message);
        } else {
            console.log(newlyCreated);
            res.redirect('/users/' + req.body.id + '/gifts')
        }
    });

});


module.exports = router;
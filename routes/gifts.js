const express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    Gift = require('../models/gift'),
    middleware = require('../middleware');

/* GET Gifts page. */
router.get('/', middleware.isLoggedIn, function(req, res, next) {

    User.find({}, function (err, allUsers) {
       if(err) {
           req.flash('error', err.message);
       } else {
           // console.log(user);
           res.render('gifts/index', { title: 'Review Gifts', users: allUsers, breadcrumbsName: 'Hello'});
       }
    });
});

// Create a Gift
router.post('/', middleware.isLoggedIn, function(req, res, next) {

    // get data from form and add to gift array.
    let username = req.body.gift.username,
        giftNumber = req.body.gift.giftNumber,
        date = req.body.date,
        giftDescription = req.body.gift.giftDescription,
        giftAmount = req.body.gift.giftAmount,
        giftCode = req.body.gift.giftCode,
        redeemCode = req.body.gift.redeemCode,
        passCode = req.body.gift.passCode,
        senderFirstName = req.body.gift.senderFirstName,
        senderLastName = req.body.gift.senderLastName,
        giftMessage = req.body.gift.giftMessage,
        newGift = { username: username, giftNumber: giftNumber, date: date, giftDescription: giftDescription, giftAmount: giftAmount, giftCode: giftCode, redeemCode: giftCode, redeemCode: redeemCode, passCode: passCode, senderFirstName: senderFirstName, senderLastName: senderLastName, giftMessage: giftMessage };


    Gift.create(req.body.id, newGift, function (err, newlyCreated) {
        if(err) {
            req.flash('error', err.message);
        } else {
            console.log(newlyCreated);
            res.redirect('/gifts');
        }
    });

});

router.get('/new', middleware.isLoggedIn, function (req, res, next) {
    res.render('gifts/new', { title: 'New Gift', user: req.user, breadcrumbsName: 'Create Gift'})
});


module.exports = router;
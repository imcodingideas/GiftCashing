const express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    Gift = require('../models/gift'),
    faker = require('faker');


/* GET Gifts page. */
router.get('/', function(req, res, next) {
    User.find({}, function (err, allUsers) {
       if(err) {
           req.flash('error', err.message);
       } else {
           res.render('gifts', { title: 'Review Gifts', user: allUsers, breadcrumbsName: ''});
       }
    });
});

// Create a Gift
router.post('/', function(req, res) {
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

     // create a new gift, and save to the database
     Gift.create(newGift, function (err, newlyCreated) {
        if(err) {
            req.flash('error', err.message);
        } else {
            console.log(newlyCreated);
            res.redirect('/')
        }
     });


});

router.get('/new', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if(err) {
            req.flash('error', err.message);
        } else {
            res.render('gifts/new', { title: 'New Gift', user: user, breadcrumbsName: 'Create Gift'})
        }
    });
});


module.exports = router;
const express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    Gifts = require('../models/gift'),
    faker = require('faker');


/* GET Gifts page. */
router.get('/', function(req, res, next) {
    User.find({}, function (err, allUsers) {
       if(err) {
           console.log(err);
       } else {
           res.render('gifts', { title: 'Review Gifts', user: allUsers });
       }
    });
});

router.get('/new', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        if(err) {
            console.log(err);
        } else {
            res.render('gifts/new', { title: 'New Gift', user: user})
        }
    });
});

module.exports = router;
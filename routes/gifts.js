const express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    Gifts = require('../models/gift'),
    faker = require('faker');


/* GET Gifts page. */
router.get('/', function(req, res, next) {
    res.render('gifts', { title: 'Review Gifts' });
});

router.get('/new', function (req, res, next) {
    User.findById(req.params.id, function (err, user) {
        console.log('Hello ' + user);
        res.send('There');
        // if(err) {
        //     console.log(err);
        // } else {
        //     res.render('gifts/new', { title: 'New Gift', user: user})
        // }
    });
});

module.exports = router;
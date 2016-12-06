const express = require('express'),
    router = express.Router({mergeParams: true}),
    User = require('../models/user'),
    Gifts = require('../models/gift'),
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
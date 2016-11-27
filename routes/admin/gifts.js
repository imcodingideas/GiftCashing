var express = require('express');
var router = express.Router();

/* GET Gifts page. */
router.get('/', function(req, res, next) {
    res.render('./admin/gifts', { title: 'Review Gifts' });
});

module.exports = router;
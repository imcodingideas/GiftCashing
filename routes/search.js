/*jshint esversion: 6 */
const express = require('express'),
	router = express.Router({
		mergeParams: true
	}),
	User = require('../models/user'),
	middleware = require('../middleware');

router.get('/', (req, res) =>{
	let firstName = req.param('firstName');
	User.findOne({
		firstName: new RegExp('^' + firstName + '$', "i")
	}, (err, doc) =>{
		if (err) {
			console.log(err)
		} else {
			res.send(doc);
		}
	});
});

module.exports = router;
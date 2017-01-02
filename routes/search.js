/*jshint esversion: 6 */
const express = require('express'),
	router = express.Router({
		mergeParams: true
	}),
	User = require('../models/user'),
	middleware = require('../middleware');

router.get('/', (req, res) =>{
	let firstName = new RegExp(escapeRegex(req.query['aliasFirstName']), 'gi');

	User.find({ aliasFirstName: firstName }).exec((err, foundUsers) =>{
		if(!err) {
			res.send(foundUsers, {'Content-Type': 'application/json'}, 200);
		} else {
			res.send(JSON.stringify(err), {'Content-Type': 'application/json'}, 404)
		}
	});
});

function escapeRegex(text) {
	return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
};

module.exports = router;
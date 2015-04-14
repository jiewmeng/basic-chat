var express = require('express');
var router = express.Router();
var User = require('../models').User;
var pubnub = require('pubnub')({
	ssl: false,
	publish_key: 'pub-c-2847b0c9-ed1b-4f6b-92c5-762ab58f3528',
	subscribe_key: 'sub-c-58b0774a-e285-11e4-aa77-0619f8945a4f'
});

router.use(function(req, res, next) {
	if (req.session.passport.user) {
		next();
	} else {
		res.redirect('/');
	}
});

router.get('/', function(req, res) {
	res.render('chatroom');
});

module.exports = router;

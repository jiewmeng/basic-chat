var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('=== in home ===');
	console.log(req.session.passport.user);

  res.render('index', { title: 'Chatroom test' });
});

module.exports = router;

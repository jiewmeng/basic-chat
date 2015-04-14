var express = require('express');
var router = express.Router();
var passport = require('passport');

router.get('/facebook', passport.authenticate('facebook'));

router.get('/facebook/callback', passport.authenticate('facebook', {
	successRedirect: '/',
	failureRedirect: '/auth/failed'
}));

router.get('/logout', function(req, res) {
	req.logout();
	res.redirect('/');
});	

router.get('/failed', function(req, res) {
	res.render('loginFailed');
});

module.exports = router;

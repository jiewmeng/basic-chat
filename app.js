var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var passport = require('passport');
var FbStrategy = require('passport-facebook').Strategy;
var mongoose = require('mongoose');
var process = require('process');

mongoose.connect(process.env.MONGOLAB_URI ? process.env.MONGOLAB_URI : 'mongodb://localhost/express-chat');
var models = require('./models');
var User = models.User;
var session = require('express-session');

var routes = require('./routes/index');
var users = require('./routes/users');
var auth = require('./routes/auth');
var chatroom = require('./routes/chatroom');
var Promise = require('bluebird');
Promise.promisifyAll(mongoose);

var app = express();

passport.serializeUser(function(user, done) {
	console.log('===in serializeUser===');
	console.log(user);

	done(null, user);
});

passport.deserializeUser(function(user, done) {
	console.log('===in deserializeUser===');
	console.log(user);
	done(null, user);
});

passport.use(new FbStrategy({
		clientID: '573979832744048',
		clientSecret: '75104013f50e0b426cc3726f3e9f03cc',
		callbackURL: 'http://localhost:3000/auth/facebook/callback'
}, function(accessToken, refreshToken, profile, done) {
	console.log(profile);
		User.findOneAsync({facebookId: profile.id})
			.then(function(user) {
				if (user) {
					user.facebookAccessToken = accessToken;
					return user.saveAsync();
				} else {
					console.log(profile);
					var user = new User({
						name: profile.displayName,
						facebookId: profile.id,
						facebookAccessToken: accessToken
					});
					return user.saveAsync();
				}
			})
			.spread(function(user, count) {
				done(null, user);
			})
			.catch(function(err) {
				done(err, null);
			});
}));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({secret: 'testing-app-secret-!@#', resave: false, saveUninitialized: false}));
app.use(passport.initialize());
app.use(passport.session());


app.use(function(req, res, next) {
	res.locals.auth = req.session.passport;
	next();
});


app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);
app.use('/auth', auth);
app.use('/chatroom', chatroom);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
		var err = new Error('Not Found');
		err.status = 404;
		next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
		app.use(function(err, req, res, next) {
				res.status(err.status || 500);
				res.render('error', {
						message: err.message,
						error: err
				});
		});
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
		res.status(err.status || 500);
		res.render('error', {
				message: err.message,
				error: {}
		});
});


module.exports = app;

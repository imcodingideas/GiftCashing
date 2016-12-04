'use strict';
const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    flash = require('connect-flash'),
    LocalStrategy = require('passport-local'),
    methodOverride = require('method-override'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    User = require('./models/user'),
    faker = require('faker'),
    path = require('path');

const indexRoute = require('./routes/index'),
    usersRoute = require('./routes/users'),
    giftsRoute = require('./routes/gifts.js');

mongoose.connect('mongodb://localhost/giftcashing');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require('express-session')({
    secret: 'anything',
    resave: false,
    saveUninitialized: false
}));

// PASSPORT CONFIGURATION
app.use(passport.initialize());
app.use(passport.session());

// use static authenticate method of model in LocalStrategy
passport.use(new LocalStrategy(User.authenticate()));

// use static serialize and deserialize of model for passport session support
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');
    next();
});

// catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err);
// });

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash('success');

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/users/:id/gifts', giftsRoute);

module.exports = app;

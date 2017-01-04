const
  express = require('express'),
  app = express(),
  bodyParser = require('body-parser'),
  mongoose = require('mongoose'),
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  passport = require('passport'),
  flash = require('connect-flash'),
  LocalStrategy = require('passport-local'),
  methodOverride = require('method-override'),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  User = require('./models/user'),
  faker = require('faker'),
  _ = require('lodash'),
  path = require('path');

const
  indexRoute = require('./routes/index'),
  usersRoute = require('./routes/users'),
  giftsRoute = require('./routes/gifts.js'),
  searchRoute = require('./routes/search');

const
  mongooseDB = process.env.DATABASEURL || 'mongodb://localhost/giftcashing';

mongoose.connect(mongooseDB);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require('express-session')({
  secret: 'anything',
  resave: false,
  saveUninitialized: false,
  store: new MongoStore({
    url: mongooseDB,
    touchAfter: 24 * 3600
  })
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
  res.locals.currentUser = req.user;
  res.locals.error = req.flash('error');
  res.locals.success = req.flash('success');
  next();
});

app.use('/', indexRoute);
app.use('/users', usersRoute);
app.use('/gifts', giftsRoute);
app.use('/search', searchRoute);

mongoose.Promise = global.Promise;

module.exports = app;

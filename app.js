const express = require('express')

const app = express()
const bodyParser = require('body-parser')
const multiparty = require('connect-multiparty')
const mongoose = require('mongoose')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)
const passport = require('passport')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const logger = require('morgan')
const cookieParser = require('cookie-parser')
const path = require('path')
const engine = require('ejs-mate')
const middleware = require('./middleware')
const cronjobs = require('./services/cronjobs')

const indexRoute = require('./routes/index')
const usersRoute = require('./routes/users')
const profileRoute = require('./routes/profile')
const giftsRoute = require('./routes/gifts.js')
const searchRoute = require('./routes/search')
const dashboardRoute = require('./routes/dashboard')
const adminsRoute = require('./routes/admin')

const config = require('./config')
require('./handlers/passport')

// view engine and layout-templates setup
app.engine('ejs', engine)
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(multiparty())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use('/bower_components', express.static(`${__dirname}/bower_components`))
app.use(methodOverride('_method'))
app.use(flash())

app.use(
  require('express-session')({
    secret: config.db.secret,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({
      url: config.db.uri,
      touchAfter: 24 * 3600,
    }),
  })
)

// PASSPORT CONFIGURATION
app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
  res.locals.currentUser = req.user
  res.locals.error = req.flash('error')
  res.locals.success = req.flash('success')
  res.locals.pagination = {
    page: parseInt(req.query.page) > 0 ? req.query.page : 1,
    pages: 0,
    perPage: 1,
    records: 0,
    showing: 0,
  }
  next()
})

app.use('/', indexRoute)
app.use('/admin/users', middleware.isLoggedIn, usersRoute)
app.use('/dashboard/profile', middleware.isLoggedIn, profileRoute)
app.use('/admin/gifts', middleware.isLoggedIn, giftsRoute)
app.use('/admin/search', searchRoute)
app.use('/dashboard', middleware.isLoggedIn, dashboardRoute)
app.use('/admin/admins', middleware.isLoggedIn, adminsRoute)

mongoose.Promise = global.Promise

// Run Cronjobs
cronjobs.runJobs()

module.exports = app

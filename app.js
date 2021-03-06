var express = require('express')
var path = require('path')
var logger = require('morgan')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var flash = require('connect-flash')

var app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.locals.pretty = true

app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

// CORS
app.use(function (req, res, next) {
  // var allowed = [
  //   'http://localhost',
  //   'http://mlrs.research.um.edu.mt'
  // ]
  // var origin = req.headers.origin
  // if (allowed.indexOf(origin) !== -1) {
  //   res.header('Access-Control-Allow-Origin', origin)
  // }
  res.header('Access-Control-Allow-Origin', '*')
  next()
})

// Server specific config
var config = require('./server-config')
app.use(function (req, res, next) {
  res.locals.baseURL = config.baseURL
  res.locals.useCDN = config.useCDN
  res.locals.analyticsCode = config.analyticsCode
  next()
})

// Stop if maintenance mode
app.use(function (req, res, next) {
  if (config.maintenanceMode) {
    res.status('503')
    res.header('Retry-After', 120) // two minutes
    res.send('This site is down for maintenance, please try again later.')
    res.end()
  } else {
    next()
  }
})

// Sessions needed for connect-flash
app.use(require('express-session')({
  secret: config.sessionSecret,
  resave: false,
  saveUninitialized: false
}))

// Database
var monk = require('monk')
var db = monk('localhost:27017/lessiki')
// Make our db accessible to our router
app.use(function (req, res, next) {
  req.db = db
  next()
})

// Authentication
var passport = require('passport')
var LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(
  {
    session: true
  },
  function (username, password, done) {
    db.get('users').findOne({username: username}, function (err, user) {
      var salted = config.salt + password
      var shasum = require('crypto').createHash('sha1')
      var hashed = shasum.update(salted).digest('hex')
      if (err) { return done(err) }
      if (!user) { return done(null, false, {message: 'Unknown user'}) }
      if (user.password !== hashed) { return done(null, false, {message: 'Incorrect password'}) }
      return done(null, user)
    })
  }
))
passport.serializeUser(function (user, cb) {
  cb(null, user._id)
})
passport.deserializeUser(function (id, cb) {
  db.get('users').findOne(id, function (err, user) {
    if (err) { return cb(err) }
    cb(null, user)
  })
})
app.use(passport.initialize())
app.use(passport.session())

// Make user info available to templates
app.use(function (req, res, next) {
  if (req.user) {
    res.locals.user = req.user
  }
  next()
})

app.use(flash())

app.use('/', require('./routes/index'))

// Custom APIs per resource
var resources = require('./resources-config')
for (var resource in resources) {
  var custom_api = './resources/' + resource + '/custom-api.js'
  try {
    app.use('/resources/' + resource + '/', require(custom_api))
  } catch (err) {
    // console.log('Not found: ' + custom_api)
  }
}

// Generic API
app.use('/resources/', require('./routes/generic-api'))

// Load bower stuff
app.use('/module', express.static(__dirname + '/bower_components/'))

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found')
  err.status = 404
  next(err)
})

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
      message: err.message,
      error: err
    })
  })
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500)
  res.render('error', {
    message: err.message,
    error: {}
  })
})

module.exports = app

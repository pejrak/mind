const formatTime = require('../format/time')
const passport = require('passport')
const User = require('../user')

module.exports = ({ app }) => {
  const self = {}
  const LOG = require('debug')('mind:auth')
  const Google = require('./google')
  const Jwt = require('./jwt')

  self.init = function() {
    passport.serializeUser(function(usr, done) {
      done(null, usr)
    })

    passport.deserializeUser(function(obj, done) {
      done(null, obj)
    })

    // Initialize Passport!  Also use passport.session() middleware, to support
    // persistent login sessions (recommended).
    app.use(passport.initialize())
    app.use(passport.session())

    Google.strategies.forEach((strategy) => {
      passport.use(strategy)
    })
    Google.registerRoutes(app, checkUser)

    Jwt.strategies.forEach((strategy) => {
      passport.use(strategy)
    })
    Jwt.registerRoutes(app, checkUser)
  }

  // Basic ensure authentication function
  // Custom made
  self.ensure = function(req, res, done) {
    var timeStamp = formatTime()

    if (req.headers.authorization) {
      passport.authenticate('jwt', { session: false }, (err, email) => {
        if (!email) {
          return res.status(401).json({ message: 'JWT login failed' })
        }
        checkUser({
          email,
          res,
          req,
        }, done)
      })(req, res, done)
      return
    }

    if (req.isAuthenticated()) {
      var email = req.user.emails[0].value
      LOG(`${req.method}:${req.path} by ${email} - ${timeStamp}`)
      checkUser({
        email,
        res,
        req,
      }, done)
    }
    else {
      res.redirect('/auth/google')
    }
  }

  self.status = function(req, res, next) {
    if (req.isAuthenticated()) {
      var email = req.user.emails[0].value

      checkUser({
        email,
        res,
        req,
      }, next)
    } else {
      return next()
    }
  }

  // PRIVATE FUNCTIONS
  // AUTHORIZATION PART
  // Custom check on the array of allowed users
  function checkUser(options, done) {
    var email = options.email
    var req = options.req
    var res = options.res

    User.loadRecord(email, function(errors, user_record) {
      req.currentUser = user_record
      res.locals.currentUser = user_record
      // If we have a callback, let's call back
      if (done) {
        return done()
      }
      else {
        // Else we redirect to former address after authentication
        res.redirect('/')
      }
    })
  }

  // END OF PRIVATE FUNCTIONS
  // Return all so that we can instantiate it
  return self
}
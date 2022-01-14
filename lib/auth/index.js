import { formatTime } from '../format/formatTime.js'
import passport from 'passport'
import { loadRecord } from '../user.js'
import debug from 'debug'
import { registerRoutes, strategies } from './jwt.js'

const LOG = debug('mind:auth')

export const init = ({ app }) => {
  const self = {}

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

    strategies.forEach((strategy) => {
      passport.use(strategy)
    })
    registerRoutes(app, checkUser)

    strategies.forEach((strategy) => {
      passport.use(strategy)
    })
    registerRoutes(app, checkUser)
  }

  // Basic ensure authentication function
  // Custom made
  self.ensure = function(req, res, done) {
    if (req.headers.authorization) {
      passport.authenticate('jwt', { session: false }, (error, email) => {
        if (error || !email) {
          return res.status(401).json({
            message: 'JWT login failed'
          })
        }
        return checkUser({
          email,
          res,
          req,
        }, done)
      })(req, res, done)
    }

    if (req.isAuthenticated()) {
      var email = req.user.emails[0].value
      LOG(`${req.method}:${req.path} by ${email} - ${formatTime()}`)
      checkUser({
        email,
        res,
        req,
      }, done)
    } else {
      res.redirect('/auth/google')
    }
  }

  self.status = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }

    return checkUser({
      email: req.user.emails[0].value,
      res,
      req,
    }, next)
  }

  // PRIVATE FUNCTIONS
  // AUTHORIZATION PART
  // Custom check on the array of allowed users
  function checkUser({ email, req, res }, done) {
    loadRecord(email, function(error, userRecord) {
      req.currentUser = userRecord
      res.locals.currentUser = userRecord
      // If we have a callback, let's call back
      if (done) {
        return done(error)
      } else {
        // Else we redirect to former address after authentication
        res.redirect('/')
      }
    })
  }
  // END OF PRIVATE FUNCTIONS
  // Return all so that we can instantiate it
  return self
}

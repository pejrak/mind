import { formatTime } from '../format/formatTime.js'
import passport from 'passport'
import { loadRecord } from '../user.js'
import debug from 'debug'
import * as JWT from './jwt.js'
import * as Google from './google.js'
import { config } from '../../config/index.js'

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

    app.use(passport.initialize())
    app.use(passport.session())
    Google.strategies.forEach(strategy => passport.use(strategy))
    Google.registerRoutes(app, checkUser)
    JWT.strategies.forEach(strategy => passport.use(strategy))
    JWT.registerRoutes(app, checkUser)
  }

  self.ensure = function(req, res, done) {
    if (req.headers.authorization) {
      passport.authenticate('jwt', { session: true }, (error, email) => {
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
      res.status(401).send({
        message: 'Not logged in.',
      })
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
        LOG('redirecting to', config.uiUrl)
        const { token } = JWT.signUser(userRecord)
        res.redirect(`${config.uiUrl}login?token=${token}`)
      }
    })
  }

  return self
}

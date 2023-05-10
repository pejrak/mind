import { formatTime } from '../format/formatTime.js'
import passport from 'passport'
import { loadRecord } from '../user.js'
import debug from 'debug'
import * as JWT from './jwt.js'
import * as Google from './google.js'
import { config } from '../../config/index.js'
import { authTokenHeader } from './constants.js'

const LOG = debug('mind:auth')
export const init = ({ app }) => {
  const self = {}

  self.init = () => {
    passport.serializeUser((usr, done) => done(null, usr))
    passport.deserializeUser((obj, done) => done(null, obj))
    app.use(passport.initialize())
    app.use(passport.session())
    Google.strategies.forEach((strategy) => passport.use(strategy))
    Google.registerRoutes(app, checkUser)
    JWT.strategies.forEach((strategy) => passport.use(strategy))
    JWT.registerRoutes(app, checkUser)
  }

  self.ensure = (req, res, done) => {
    if (req.headers[authTokenHeader]) {
      return passport.authenticate(
        'jwt',
        { session: true },
        (error, user) => {
          if (error || !user) {
            LOG('JWT login error, user', error, user)
            return res.status(401).json({
              message: 'JWT login failed',
            })
          }
          return checkUser(
            {
              email: user.email,
              res,
              req,
            },
            done,
          )
        },
      )(req, res, done)
    }

    if (req.isAuthenticated()) {
      var email = req.user.emails[0].value
      LOG(`${req.method}:${req.path} by ${email} - ${formatTime()}`)
      return checkUser(
        {
          email,
          res,
          req,
        },
        done,
      )
    } else {
      LOG('Not logged in.')
      res.status(401).send({
        message: 'Not logged in.',
      })
    }
  }

  self.status = function(req, res, next) {
    if (!req.isAuthenticated()) {
      return next()
    }

    return checkUser(
      {
        email: req.user.emails[0].value,
        res,
        req,
      },
      next,
    )
  }

  // Custom check on the array of allowed users
  function checkUser({ email, req, res }, done) {
    loadRecord(email, (error, userRecord) => {
      req.currentUser = userRecord
      res.locals.currentUser = userRecord
      // If we have a callback, let's call back
      LOG('checkUser done', { error, email })
      if (typeof done === 'function') {
        return done(error)
      }
      LOG('checkUser token')
      // Else we redirect to former address after authentication
      const { token } = JWT.signUser(userRecord)
      LOG('redirecting to', config.uiUrl, token)
      res.redirect(`${config.uiUrl}login?token=${token}`)
    })
  }

  return self
}

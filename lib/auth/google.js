import debug from 'debug'
import passport from 'passport'
import { OAuth2Strategy } from 'passport-google-oauth'
import { config } from '../../config/index.js'

const LOG = debug('mind:google')
const {
  googleOauth: { key: GOOGLE_CLIENT_ID, secret: GOOGLE_CLIENT_SECRET },
} = config

const realm = config.getCurrentEnvConfig().serverUrl
const CALLBACK_PATH = 'api/auth/google/return'
const callbackURL = `${realm}${CALLBACK_PATH}`
LOG('callbackURL', callbackURL)
const verifyCallback = (_a, _r, profile, done) => process.nextTick(
  () => done(null, profile)
)

export const strategies = [
  new OAuth2Strategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    realm,
    callbackURL,
  }, verifyCallback),
]

export const registerRoutes = function(app, checkUser) {
  LOG('registering')
  app.get(
    '/api/auth/google',
    passport.authenticate(
      'google',
      {
        scope: [
          'email',
        ],
      }
    ),
    () => {}
  )

  app.get(
    `/${CALLBACK_PATH}`,
    passport.authenticate(
      'google',
      { failureRedirect: '/#/login' }
    ),
    (req, res) => {
      const email = req.user.emails[0].value

      checkUser({
        email,
        res,
        req,
      })
    }
  )

  app.get('/logout', function(req, res) {
    req.logout()
    res.redirect('/#/login')
  })
}

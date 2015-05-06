'use strict'

module.exports = function(MIND) {

  // Initializations
  var me = {}

  // Use the GoogleStrategy within Passport.
  //   Strategies in passport require a `validate` function, which accept
  //   credentials (in this case, an OpenID identifier and profile), 
  //   and callback with a user object.
  var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy

  // get from: https://code.google.com/apis/console
  var GOOGLE_OAUTH = MIND.config.google_oauth
  var GOOGLE_CLIENT_ID = GOOGLE_OAUTH.key
  var GOOGLE_CLIENT_SECRET = GOOGLE_OAUTH.secret
  var passport = require('passport')
  var user = MIND.user
  var common = MIND.common
  var LOG = MIND.LOG('auth')
  var googleRealm
  var googleReturnURL

  // Constants and user listing
  me.init = function(app) {

    switch (MIND.env) {
      case 'development':
        googleRealm = 'https://localhost/'
        break
      case 'production':
        googleRealm = 'https://www.wakinga.com/'
        break
      case 'test':
        googleRealm = 'https://www.wakinga.com/'
        break
      default:
        googleRealm = 'https://localhost/'
    }
    
    // Passport session setup.
    //   To support persistent login sessions, Passport needs to be able to
    //   serialize users into and deserialize users out of the session.  Typically,
    //   this will be as simple as storing the user ID when serializing, and finding
    //   the user by ID when deserializing.  However, since this example does not
    //   have a database of user records, the complete Google profile is serialized
    //   and deserialized.

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
    
    //PASSPORT specific END
    
    passport.use(
      new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        realm: googleRealm,
        callbackURL: googleRealm + 'auth/google/return'
      },
      function(accessToken, refreshToken, profile, done) {
        // To keep the example simple, the user's Google profile is returned to
        // represent the logged-in user.  In a typical application, you would want
        // to associate the Google account with a user record in your database,
        // and return that user instead.

        process.nextTick(function () {
          return done(null, profile)
        })
      }
    ))
    // GET /auth/google
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  The first step in Google authentication will involve redirecting
    //   the user to google.com.  After authenticating, Google will redirect the
    //   user back to this application at /auth/google/return
    app.get('/auth/google', 
      passport.authenticate('google', 
        { 
          scope: [
            'email'
          ]
        }
      ),
      function(req, res) {
        //LOG("/auth/google res:", res)
      }
    )

    // GET /auth/google/return
    //   Use passport.authenticate() as route middleware to authenticate the
    //   request.  If authentication fails, the user will be redirected back to the
    //   login page.  Otherwise, the primary route function function will be called,
    //   which, in this example, will redirect the user to the home page.
    app.get('/auth/google/return',
      passport.authenticate(
        'google', { failureRedirect: '/login' }),
      function(req, res) {
        var email = req.user.emails[0].value
        checkUser({ email: email, res: res, req: req })
      }
    )
    
    //authentication routes
    
    app.get('/logout', function(req, res){
      req.logout()
      res.redirect('/login')
    })

    app.get('/login', function(req, res){
      res.render('login', { 
        user: req.user, 
      })
    })

    app.get('/noaccess', function(req, res){
      res.render('noaccess', { 
        user: req.user, 
      })
    })
  }

  // Basic ensure authentication function
  // Custom made
  me.ensure = function(req, res, done) {
    var time_stamp = (new Date()).toString()
    req.session.redirect_to = req.path || '/'

    if (req.isAuthenticated()) {
      var email = req.user.emails[0].value
      LOG('Access to:', req.path, 'by:', email, '|', time_stamp)
      checkUser({
        email: email,
        res: res,
        req: req
      }, done)
    }
    else {
      res.redirect('/auth/google')
    }
  }

  me.status = function(req, res, next) {
    if (req.isAuthenticated()) {
      var email = req.user.emails[0].value

      checkUser({ email: email, res: res, req: req }, next)
    }
    else {
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

    user.loadRecord(email, function(errors, user_record) {
      req.current_user = user_record
      res.locals.current_user = user_record
      // If we have a callback, let's call back
      if (done) {
        return done()
      }
      else {
        // Else we redirect to former address after authentication
        var redirect_to = (req.session.redirect_to || '/')
        req.session.redirect_to = null
        res.redirect(redirect_to)
      }
    })
  }

  // END OF PRIVATE FUNCTIONS
  // Return all so that we can instantiate it
  return me
}
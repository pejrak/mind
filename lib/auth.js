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
  var GOOGLE_CLIENT_ID = MIND.config.google_oauth.key
  var GOOGLE_CLIENT_SECRET = MIND.config.google_oauth.secret
  var passport = require('passport')
  var user = MIND.user
  var common = MIND.common
  var LOG = MIND.LOG('auth')
  var googleRealm
  var googleReturnURL
      
  // Constants and user listing 
  me.initiate = function(app) {
    switch (MIND.env) {
      case 'development':
        googleRealm = 'https://localhost/'
        break
      case 'production':
        googleRealm = 'https://wakinga.com/'
        break
      case 'test':
        googleRealm = 'https://wakinga.com/'
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

    passport.serializeUser(function(user, done) {
      done(null, user)
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
        // asynchronous verification, for effect...
        process.nextTick(function () {
          // To keep the example simple, the user's Google profile is returned to
          // represent the logged-in user.  In a typical application, you would want
          // to associate the Google account with a user record in your database,
          // and return that user instead.
          //profile.identifier = identifier
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
            'https://www.googleapis.com/auth/userinfo.profile', 
            'https://www.googleapis.com/auth/userinfo.email'
          ]
        }
      ),
      function(req, res) {}
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
        allowedUser(req.user.emails[0].value, function(yes, user) {
          if (yes) {
            req.current_user = user.record
            res.locals.current_user = user.record
            var redirect_to = req.session.redirect_to || '/'
            delete req.session.redirect_to
            res.redirect(redirect_to)
          }
          else {
            res.redirect('/noaccess')
          }
        })
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
  me.ensure = function(req, res, next) {
   
    req.session.redirect_to = req.path || '/'
    var time_stamp = (new Date()).toString()
    if (req.isAuthenticated()) {
      LOG(
        'Access to:', 
        req.path, 'by:', 
        req.user.emails[0].value, '|', time_stamp
      )
      allowedUser(req.user.emails[0].value, function(yes, user) {
        var loaded_user = user || {}
        req.current_user = user.record
        res.locals.current_user = user.record
        MIND.monitor.recordReq(req)
        if (yes) {
          return next()
        }
        else {
          res.redirect('/noaccess')
        }
      })
    }
    else {
      res.redirect('/auth/google')
    }

  }


  // PRIVATE FUNCTIONS

  // AUTHORIZATION PART
  // Custom check on the array of allowed users
  function allowedUser(email, callback) {
    user.authenticate(email, function(error, loaded_user) {
      callback((error ? null : true), loaded_user)
    })
  }

  // END OF PRIVATE FUNCTIONS

  // Return all so that we can instantiate it
  return me

}
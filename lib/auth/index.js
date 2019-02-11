'use strict'

module.exports = function (MIND) {

    // Initializations
    var me = {}
    var passport = require('passport')
    var user = MIND.user
    var LOG = MIND.LOG('auth')
    var Google = require('./google')
    var Jwt = require('./jwt');

    // Constants and user listing
    me.init = function (app) {
        passport.serializeUser(function (usr, done) {
            done(null, usr)
        })

        passport.deserializeUser(function (obj, done) {
            done(null, obj)
        })

        // Initialize Passport!  Also use passport.session() middleware, to support
        // persistent login sessions (recommended).
        app.use(passport.initialize())
        app.use(passport.session())

        Google.strategies.forEach((strategy) => {
            passport.use(strategy);
        });
        Google.registerRoutes(app, checkUser)

        Jwt.strategies.forEach((strategy) => {
            passport.use(strategy);
        });
        Jwt.registerRoutes(app, checkUser);
    }

    // Basic ensure authentication function
    // Custom made
    me.ensure = function (req, res, done) {
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

    me.status = function (req, res, next) {
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

        user.loadRecord(email, function (errors, user_record) {
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
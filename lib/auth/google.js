const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const config = require('../../conf/config');

const {
    google_oauth: {
        key: GOOGLE_CLIENT_ID,
        secret: GOOGLE_CLIENT_SECRET,
    }
} = config;

const realm = config.getCurrentEnvConfig().url || 'https://localhost';
const CALLBACK_PATH = 'auth/google/return';

function verifyCallback(accessToken, refreshToken, profile, done) {
    process.nextTick(function () {
        return done(null, profile);
    });
}

exports.strategies = [
    new GoogleStrategy({
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        realm,
        callbackURL: realm + CALLBACK_PATH,
    }, verifyCallback),
];

exports.registerRoutes = function(app, checkUser) {
    app.get(
        '/auth/google',
        passport.authenticate(
            'google',
            {
                scope: [
                    'email',
                ],
            }
        ),
        () => {}
    );

    app.get(
        CALLBACK_PATH,
        passport.authenticate(
            'google',
            { failureRedirect: '/login' }
        ),
        (req, res) => {
            const email = req.user.emails[0].value;
            checkUser({
                email,
                res,
                req,
            });
        }
    );

    app.get('/logout', function (req, res) {
        req.logout()
        res.redirect('/login')
    });

    app.get('/login', function (req, res) {
        res.render('login', {
            user: req.user,
        })
    });

    app.get('/noaccess', function (req, res) {
        res.render('noaccess', {
            user: req.user,
        })
    })
}

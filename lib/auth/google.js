const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy
const config = require('../../conf/config');

const {
    config: {
        google_oauth: {
            key: GOOGLE_CLIENT_ID,
            secret: GOOGLE_CLIENT_SECRET,
        }
    }
} = config;

const realm = config.getCurrentEnvConfig().url || 'https://localhost';
const CALLBACK_PATH = 'auth/google/return';

exports.strategy = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    realm,
    callbackURL: realm + CALLBACK_PATH,
});

exports.callback = function (accessToken, refreshToken, profile, done) {
    process.nextTick(() => {
        return done(null, profile);
    });
}

exports.registerRoutes = function(app, checkUser) {
    app.get(
        '/auth/google',
        passport.authenticate(
            'google',
            {
                scope: [
                    'email',
                ],
            },
        ),
        () => {},
    );

    app.get(
        CALLBACK_PATH,
        passport.authenticate(
            'google',
            { failureRedirect: '/login' },
        ),
        (req, res) => {
            const email = req.user.emails[0].value;
            checkUser({
                email,
                res,
                req,
            });
        },
    );
}

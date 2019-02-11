const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require('../../conf/config');
const Storage = require('../storage')();

function localStrategyCallback(email, password, done) {
    Storage.check(email, (err, checkResult) => {
        if (err || !checkResult.remote_mind) {
            done(err, false, { message: 'Email not registered' });
            return;
        }

        bcrypt.compare(password, checkResult.remote_mind.password, (err, res) => {
            if (err || !res) {
                done(true, false, { message: 'Password incorrect' });
                return;
            }
            done(null, email, { message: 'Logged in' });
        });
    });
}

function jwtCallback(jwtPayload, done) {
    Storage.check(jwtPayload, (err) => {
        if (err) {
            return done(err);
        }
        return done(null, jwtPayload);
    });
}

exports.strategies = [
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, localStrategyCallback),
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt_auth.secret,
    }, jwtCallback)
];

exports.registerRoutes = function(app, checkUser) {
    app.post('/login-jwt', (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) {
                res.status(401).send(err);
            } else if (!user) {
                res.status(401).send(info);
            } else {
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        res.send(err);
                    }

                    const token = jwt.sign(user, config.jwt_auth.secret);
                    return res.json({ user, token });
                });
            }
        })(req, res);
    });

    app.post('/register-jwt', (req, res) => {
        const { email, password } = req.body;
        console.log('Register-jwt', email, password);
        Storage.check(email, (err, checkResult) => {
            if (err || checkResult.remote_mind) {
                res.status(400).send({ message: 'Email already used' });
                return;
            }
            bcrypt.hash(password, 10, (err, passwordHash) => {
                Storage.save({
                    user_email: email,
                    storage_type: 'remote_mind',
                    content: {
                        password: passwordHash,
                        posts: [],
                    },
                }, (err) => {
                    if (err) {
                        res.status(400).send(err);
                        return;
                    }
                    res.status(201).send({ message: 'Registration successfull' });
                });
            });
        });
    });
}
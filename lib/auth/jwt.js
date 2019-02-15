const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const passportJWT = require("passport-jwt");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const config = require('../../conf');
const Storage = require('../storage')();

function localStrategyCallback(email, password, done) {
    const loadOptions = {
        user_email: email,
        storage_type: 'remote_mind',
    };
    Storage.load(loadOptions, (loadError, contentString) => {
        if (loadError) {
            done(loadError, false, { message: 'Email not registered' });
            return;
        }

        const content = JSON.parse(contentString);
        bcrypt.compare(password, content.password, (compareError, res) => {
            if (compareError || !res) {
                done(compareError, false, { message: 'Password incorrect' });
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
                res.status(401).send({err, user, info});
            } else if (!user) {
                res.status(401).send({err, user, info});
            } else {
                req.login(user, { session: false }, (err) => {
                    if (err) {
                        res.status(401).send({ message: "Error login", err });
                        return;
                    }

                    const token = jwt.sign(user, config.jwt_auth.secret);
                    return res.json({ user, token });
                });
            }
        })(req, res);
    });

    app.post('/register-jwt', (req, res) => {
        const { email, password } = req.body;
        Storage.check(email, (err, checkResult) => {
            if (err || checkResult.remote_mind) {
                res.status(400).send({ message: 'Email already used' });
                return;
            }
            bcrypt.hash(password, 10, (err, passwordHash) => {
                const stringifiedContent = JSON.stringify({
                    email,
                    password: passwordHash,
                    posts: [],
                });
                Storage.save({
                    user_email: email,
                    storage_type: 'remote_mind',
                    content: stringifiedContent,
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
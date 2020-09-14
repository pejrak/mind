const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const passportJWT = require("passport-jwt")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const uuidv4 = require('uuid/v4')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt
const config = require('../../conf')
const Storage = require('../storage')()

exports.strategies = [
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
    }, localStrategyCallback),
    new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
        secretOrKey: config.jwt_auth.secret,
    }, jwtCallback)
]

exports.registerRoutes = function(app, checkUser) {
    app.post('/login-jwt', (req, res, next) => {
        authenticate(req, res)
            .then((credentials) => {
                res.json(credentials)
            })
            .catch((error) => {
                res.status(401).send({ message: error })
            })
    })

    app.post('/register-jwt', (req, res) => {
        const { email, password } = req.body
        registerNewUser(email, password)
            .then(() => {
                res.status(201).send({ message: 'Registration successfull' })
            })
            .catch((error) => {
                res.status(400).send({ message: error })
            })
    })
}

function localStrategyCallback(email, password, done) {
    loginUser(email, password)
        .then((loginResult) => {
            done(null, loginResult.email, { message: 'Logged in' })
        })
        .catch((error) => {
            done(error, false, { message: error })
        })
}

function jwtCallback(jwtPayload, done) {
    Storage.check(jwtPayload, (err) => {
        if (err) {
            return done(err)
        }
        return done(null, jwtPayload)
    })
}

function authenticate(request, response) {
    return authenticateViaPassport(request, response)
        .then(requestLogin)
        .then(signUser)
}

function authenticateViaPassport(request, response) {
    return new Promise((resolve, reject) => {
        passport.authenticate('local', (error, user, info) => {
            if (error || !user) {
                reject({ error, user, info })
                return
            }
            resolve({
                request,
                user,
            })
        })(request, response)
    })
}

function requestLogin({ request, user }) {
    return new Promise((resolve, reject) => {
        request.login(user, { session: false }, (error) => {
            if (error) {
                reject('Error login')
                return
            }
            resolve(user)
        })
    })
}

function signUser(user) {
    return new Promise((resolve, reject) => {
        const token = jwt.sign(user, config.jwt_auth.secret)
        resolve({
            user,
            token,
        })
    })
}

function registerNewUser(email, password) {
    return checkIfUserExists({ email, password })
        .then(createInitialContent)
        .then(saveUser)
}

function loginUser(email, password) {
    return loadStorage({ email, password })
        .then(comparePasswords)
        .then(createLoginResult)
}

function loadStorage({ email, password }) {
    return new Promise((resolve, reject) => {
        Storage.load({
            user_email: email,
            storage_type: 'remote_mind',
        }, (error, contentString) => {
            if (error) {
                reject("Email not registered")
                return
            }
            resolve({
                email,
                password,
                content: JSON.parse(contentString),
            })
        })
    })
}

function createLoginResult({ email, content }) {
    return new Promise((resolve, reject) => {
        resolve({
            email,
            publicToken: content.publicToken,
        })
    })
}

function comparePasswords(user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(user.password, user.content.password, (error, doMatch) => {
            if (error || !doMatch) {
                reject("Password incorrect")
                return
            }
            resolve(user)
        })
    })
}

function createInitialContent({ email, password }) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, 10, (error, passwordHash) => {
            if (error) {
                reject(error)
                return
            }
            const publicToken = uuidv4()
            resolve({
                email,
                publicToken,
                password: passwordHash,
                posts: [],
            })
        })
    })
}

function saveUser(initialContent) {
    return new Promise((resolve, reject) => {
        Storage.save({
            user_email: initialContent.email,
            storage_type: 'remote_mind',
            content: JSON.stringify(initialContent),
        }, (error) => {
            if (error) {
                reject(error)
                return
            }
            resolve()
        })
    })
}

function checkIfUserExists(user) {
    return new Promise((resolve, reject) => {
        Storage.check(user.email, (error, checkResult) => {
            if (error || checkResult.remote_mind) {
                reject("User already exists")
                return
            }
            resolve(user)
        })
    })
}

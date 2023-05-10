import { config } from '../../config/index.js'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import JWT from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import uuid from 'uuid'
import { check } from '../storage.js'

export const strategies = [
  new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
  }, localStrategyCallback),
  new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.jwtAuth.secret,
  }, jwtCallback)
]

export const registerRoutes = function(app, checkUser) {
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
  check(jwtPayload, (err) => {
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
        reject(error)
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
        reject(error)
        return
      }
      resolve(user)
    })
  })
}

export function signUser(user) {
  return {
    user,
    token: JWT.sign(user, config.jwtAuth.secret),
  }
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
      userEmail: email,
      storageType: 'remoteMind',
    }, (error, contentString) => {
      if (error) {
        reject(error)
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

async function comparePasswords(user) {
  bcrypt.compare(user.password, user.content.password, (error, doMatch) => {
    if (error || !doMatch) {
      throw error
    }
    return user
  })
}

function createInitialContent({ email, password }) {
  return new Promise((resolve, reject) => {
    bcrypt.hash(password, 10, (error, passwordHash) => {
      if (error) {
        reject(error)
        return
      }
      const publicToken = uuid()
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
      userEmail: initialContent.email,
      storageType: 'remoteMind',
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
      if (error || checkResult.remoteMind) {
        reject(error)
        return
      }
      resolve(user)
    })
  })
}

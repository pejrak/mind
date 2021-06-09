const express = require('express')
const Config = require('../config')

var methodOverride = require('method-override')
var cookieParser = require('cookie-parser')
var logger = require('morgan')
var session = require('express-session')
const connectRedis = require('connect-redis')
var RedisStore = connectRedis(session)
var cors = require('cors')
// var helmet = require('helmet')
const app = express()

// Internal declarations
const DIRECTORY = require('./system/directory')
const ENV = require('./system/environment')
const PORT = require('./system/port')
const routes = require('./routes')
const { getNewClient } = require('./db/redis')

// Initialize express app
function initialize() {
  var frontLimit = (1024 * 1024 * 50)

  // Use views directory
  app.set('views', DIRECTORY + '/views')
  // Use jade to render HTML
  app.set('view engine', 'pug')
  // Set static paths
  app.use(express.static(DIRECTORY + '/public'))
  app.use(methodOverride())
  app.use(cookieParser())
  app.use(express.urlencoded({
    parameterLimit: 50000,
    limit: frontLimit,
    extended: true
  }))
  app.use(logger('tiny'))
  app.use(express.json({
    limit: frontLimit,
  }))
  app.use(session({
    key: `${Config.name}-${ENV}.sid`,
    resave: true,
    store: new RedisStore({
      client: getNewClient()
    }),
    secret: `${Config.secret}-${ENV}`,
    saveUninitialized: true,
    cookie: {
      iAmInitial: true,
      // set the maximum session age to a month
      maxAge: (30 * 24 * 60 * 60 * 1000),
      sameSite: 'Lax'
    }
  }))

  app.use(cors())
  app.set('port', PORT)

  routes({ app })
  return app
}

module.exports = initialize

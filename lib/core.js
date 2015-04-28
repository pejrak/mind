'use strict'
// Internal app operations

module.exports = function(MIND) {

  // External dependencies
  var multer = require('multer')
  var path = require('path')
  var favicon = require('serve-favicon')
  var methodOverride = require('method-override')
  var cookieParser = require('cookie-parser')
  var bodyParser = require('body-parser')
  var logger = require('morgan')
  var session = require('express-session')
  var RedisStore = require('connect-redis')(session)

  // Internal declarations
  var LOG = MIND.LOG('core')
  var CONTROLLERS = ['home']
  var MODULES = ['user', 'auth', 'route']
  var MODULE_DIR = (MIND.dir + '/lib/')
  var CONTROLLER_DIR = (MIND.dir + '/controllers/')

  // Initialize controllers for route handling
  function initControllers() {
    CONTROLLERS.forEach(loadController)
  }

  // Initialize express app
  function initialize() {
    var app = MIND.app
    var front_limit = (1024 * 1024 * 50)

    // Use jade to render HTML
    app.set('view engine', 'jade')
    // Set static paths
    app.use(MIND.express.static(MIND.dir + '/public'))
    app.use(methodOverride())
    app.use(cookieParser())
    app.use(bodyParser.urlencoded({ 
      parameterLimit: 50000,
      limit: front_limit,
      extended: true 
    }))
    app.use(bodyParser.json({ 
      limit: front_limit,
      parameterLimit: 50000
    }))
    app.use(session({ 
      key: (MIND.name + '-' + MIND.env + '.sid'),
      store: new RedisStore(), 
      secret: (MIND.config.secret + MIND.env),
      resave: true,
      saveUninitialized: true
    }))

    // Use views directory
    app.set('views', MIND.dir + '/views')
    // Port setting
    app.set('port', MIND.port)

    // Initialize authentication module extra
    initModules()
    MIND.auth.init(app)
    initControllers()
  }

  function loadController(controller) {
    MIND[controller] = require(CONTROLLER_DIR + controller)(MIND)
  }

  function initModules() {
    MODULES.forEach(loadModule)
  }

  function loadModule(module_name) {
    MIND[module_name] = require(MODULE_DIR + module_name)(MIND)
  }

  return {
    initControllers: initControllers,
    initModules: initModules,
    init: initialize,
    CONTROLLERS: CONTROLLERS,
    CONTROLLER_DIR: CONTROLLER_DIR,
    MODULES: MODULES,
    MODULE_DIR: MODULE_DIR
  }
}
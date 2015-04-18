'use strict'

// Require external dependencies
var express = require('express')

// Internal setup
var app = express()
var common = require('./lib/common')
var LOG = common.LOG('app')
var environment = (process.env.NODE_ENV || 'development')
var port = (process.env.PORT || 3000)

// Create MIND object to pass around and assign components to it
var MIND = {
  name: 'Mind',
  env: environment,
  config: require('./conf/config'),
  app: app,
  express: express,
  LOG: common.LOG,
  common: common,
  dir: __dirname
}

// Load core for initialization
MIND.core = require('./lib/core')(MIND)

MIND.core.init()

// Start server listening
app.listen(port, function() {
  LOG('App on port:', port)
})



'use strict'

// Require external dependencies
var express = require('express')

// Internal setup
var app = express()
var common = require('./lib/common')
var LOG = common.LOG('app')
var port = (process.env.PORT || 3000)

// Create MIND object to pass around and assign components to it
var MIND = {
  name: 'Mind',
  app: app,
  express: express,
  common: common,
  dir: __dirname
}

// Load core for initialization
MIND.core = require('./lib/core')(MIND)
MIND.core.init()

// Start http server listening
app.listen(port, function() {
  LOG('(' + MIND.name + ') application listening on port:', port)
})



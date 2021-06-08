// Storage

var { storage_dir: storageDir } = require('../config').getCurrentEnvConfig()
var common = require('./common')
var fs = require('fs')
var async = require('async')
var Dropbox = require('dropbox')

function getLocalFileName(userEmail) {
  return ('temporary_fragments_' + common.hashCode(userEmail))
}

function getLocalFilePath(userEmail) {
  return (storageDir + '/' + getLocalFileName(userEmail))
}

function save(options, done) {
  var userEmail = options.userEmail
  var storageType = options.storageType
  var content = options.content
  var filePath = getLocalFilePath(userEmail)

  if (storageType === 'remoteMind') {
    fs.writeFile(filePath, content, done)
  } else if (
    storageType === 'remoteDropbox' &&
    options.user_record.storageKey &&
    options.user_record.storageSecret
  ) {
    // handle dropbox saving
    saveToDropbox(options, done)
  }
}

function saveToDropbox(options, done) {
  var key = options.user_record.storageKey
  var secret = options.user_record.storageSecret
  var client = new Dropbox.Client({
    key: key,
    secret: secret
  })

  async.series([
    function(next) {
      client.authDriver(new Dropbox.AuthDriver.NodeServer(3000))
      client.authenticate(function(error, client) {
        return next()
      })
    },
    function(next) {
      client.getAccountInfo(function(error, accnt_info) {
        return next()
      })
    }
  ], done)
}

function load(options, done) {
  var userEmail = options.userEmail
  var storageType = options.storageType
  var filePath = getLocalFilePath(userEmail)

  if (storageType === 'remoteMind') {
    fs.readFile(filePath, function(errors, data) {
      var content = (!errors && data ? data.toString() : null)
      return done(errors, content)
    })
  } else {
    // handle dropbox saving
    return done()
  }
}

function storageOptionsValid(options) {
  return (
    options.storageKey && options.storageKey.length &&
    options.storageKey.length < 100 &&
    options.storageSecret && options.storageSecret.length &&
    options.storageSecret.length < 100
  )
}

function check(userEmail, done) {
  async.parallel({
    remoteMind: function(next) {
      checkLocalStore(userEmail, next)
    },
    remoteDropbox: function(next) {
      return next()
    }
  }, done)
}

function checkLocalStore(userEmail, done) {
  var filePath = getLocalFilePath(userEmail)

  fs.exists(filePath, exists => done(null, exists))
}

module.exports = {
  check,
  load,
  save,
  storageOptionsValid,
}

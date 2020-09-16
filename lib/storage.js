// Storage

var env_conf = require('../config').getCurrentEnvConfig()
var common = require('./common')
var fs = require('fs')
var async = require('async')
var storage_dir = env_conf.storage_dir
var Dropbox = require("dropbox")

function getLocalFileName(userEmail) {
  return ("temporary_fragments_" + common.hashCode(userEmail))
}

function getLocalFilePath(userEmail) {
  return (storage_dir + "/" + getLocalFileName(userEmail))
}

function save(options, done) {
  var userEmail = options.userEmail
  var storageType = options.storageType
  var content = options.content
  var target_file_path = getLocalFilePath(userEmail)

  if (storageType === "remoteMind") {
    fs.writeFile(target_file_path, content, done)
  }
  else if (
    storageType === "remoteDropbox" &&
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
  var target_file_path = getLocalFilePath(userEmail)

  if (storageType === "remoteMind") {
    fs.readFile(target_file_path, function(errors, data) {
      var content = (!errors && data ? data.toString() : null)
      return done(errors, content)
    })
  }
  else {
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
  var file_path = getLocalFilePath(userEmail)

  fs.exists(file_path, exists => done(null, exists))
}

module.exports = {
  check,
  load,
  save,
  storageOptionsValid,
}
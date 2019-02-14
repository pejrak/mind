// Storage
module.exports = function () {
  var env_conf = require('../conf').getCurrentEnvConfig();
  var common = require('./common');
  var fs = require('fs')
  var async = require('async')
  var storage_dir = env_conf.storage_dir
  var Dropbox = require("dropbox");

  function getLocalFileName(user_email) {
    return ("temporary_fragments_" + common.hashCode(user_email))
  }

  function getLocalFilePath(user_email) {
    return (storage_dir + "/" + getLocalFileName(user_email))
  }

  function save(options, done) {
    var user_email = options.user_email
    var storage_type = options.storage_type
    var content = options.content
    var target_file_path = getLocalFilePath(user_email)
    
    if (storage_type === "remote_mind") {
      fs.writeFile(target_file_path, content, done)  
    }
    else if (
      storage_type === "remote_dropbox" && 
      options.user_record.storage_key &&
      options.user_record.storage_secret
    ) {
      // handle dropbox saving
      saveToDropbox(options, done)
    }
  }

  function saveToDropbox(options, done) {
    var key = options.user_record.storage_key
    var secret = options.user_record.storage_secret
    var client = new Dropbox.Client({
          key: key,
          secret: secret
        })

    async.series([
      function (next) {
        client.authDriver(new Dropbox.AuthDriver.NodeServer(3000))
        client.authenticate(function(error, client) {
          return next()
        })
      },
      function (next) {
        client.getAccountInfo(function(error, accnt_info) { 
          return next()
        })
      }
    ], done)
  }

  function load(options, done) {
    var user_email = options.user_email
    var storage_type = options.storage_type
    var target_file_path = getLocalFilePath(user_email)
    
    if (storage_type === "remote_mind") {
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
      options.storage_key && options.storage_key.length && 
      options.storage_key.length < 100 && 
      options.storage_secret && options.storage_secret.length && 
      options.storage_secret.length < 100
    )
  }

  function check(user_email, done) {
    async.parallel({
      remote_mind: function(next) {
        checkLocalStore(user_email, next)
      },
      remote_dropbox: function(next) {
        return next()
      }
    }, done)
  }

  function checkLocalStore(user_email, done) {
    var file_path = getLocalFilePath(user_email)

    fs.exists(file_path, function(exists) {
      return done(null, exists)
    })
  }

  return {
    check: check,
    storageOptionsValid: storageOptionsValid,
    save: save,
    load: load
  }
}
// Storage
module.exports = function (MIND) {

  var LOG = MIND.LOG('home')
  var env_conf = MIND.config[MIND.env]
  var common = MIND.common
  var fs = require('fs')
  var async = require('async')
  var storage_dir = env_conf.storage_dir

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
    else {
      // handle dropbox saving
      return done()
    }
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
    save: save,
    load: load
  }
}
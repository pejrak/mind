// Storage
module.exports = function (MIND) {

  var LOG = MIND.LOG('home')
  var env_conf = MIND.config[MIND.env]
  var common = MIND.common
  var fs = require('fs')
  var storage_dir = env_conf.storage_dir


  function save(options, done) {
    var user_email = options.user_email
    var storage_type = options.storage_type
    var content = options.content
    var file_name = "temporary_fragments_" + common.hashCode(user_email)
    var target_file_path = (storage_dir + "/" + file_name)
    
    if (storage_type === "remote_mind") {
      fs.writeFile(target_file_path, content, done)  
    }
    else {
      // handle dropbox saving
    }
    
  }


  return {}
}
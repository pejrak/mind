'use strict'

module.exports = function (MIND) {

  var LOG = MIND.LOG('home')
  var common = MIND.common

  MIND.route.get('/', function (req, res) {
    res.render('home/home')
  }, { no_auth: true })

  MIND.route.get('/profile', function (req, res) {
    res.send({
      profile: req.current_user
    })
  })

  MIND.route.post('/profile/update', function (req, res) {
    var storage_options = {
      storage_key: req.body.key,
      storage_secret: req.body.secret,
    }

    if (MIND.storage.storageOptionsValid(storage_options)) {
      var email = req.current_user.email
      MIND.user.assignToRecord(email, storage_options, function(errors) {
        LOG("profile update | errors, storage_options:", errors, storage_options)
        res.send({
          message: (
            errors ? 
              "Unable to update profile options." : 
              "Profile update complete."
            )
        })
      })
    }
    else {
      res.send({message: "Invalid storage options."})
    }
  })

  MIND.route.post('/check_path_component', function (req, res) {
    var query = req.body.query

    if (query && query.length) {
      MIND.paths.checkIfExists(query, finalize)     
    }
    else finalize()
    
    function finalize(error, exists) {

      res.send({
        message: (
          (error || !exists) ? 
            "Unable to find matching path component." : 
            "Found matching path component"
        ),
        success: (!error && exists)
      })
    }
  }, { no_auth: true })

  MIND.route.post('/store/:storage_type', function (req, res) {
    var extract = req.body.extract
    var storage_type = req.params.storage_type
    var user_email = (req.current_user || {}).email

    if (user_email) {
      MIND.storage.save({
        user_email: user_email,
        user_record: req.current_user,
        storage_type: storage_type,
        content: extract
      }, function (error) {
        res.send({
          message: (error ? "Unable to write file." : "Memory written.")
        })
      })
    }
    else {
      res.send({ message: "Unable to recognize user." })
    }
  })

  MIND.route.get('/storage/status', function (req, res) {
    var user_email = (req.current_user || {}).email

    if (user_email) {
      MIND.storage.check(user_email, function(errors, source_options) {
        res.send({
          source_options: source_options,
          message: "Checked storage options."
        })
      })
    }
    else {
      res.send({
        message: "Login again to access storage options.",
        source_options: null
      })
    }
  })

  MIND.route.get('/storage/load/:storage_type', function (req, res) {
    var user_email = (req.current_user || {}).email
    var storage_type = req.params.storage_type

    if (user_email) {
      MIND.storage.load({
        user_email: user_email,
        storage_type: storage_type
      }, function(errors, content) {
        res.send({
          content: content,
          message: "Loaded storage."
        })
      })
    }
    else {
      res.send({
        message: "Login again to access storage options."
      })
    }
  })

  return {}
}
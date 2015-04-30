'use strict'

module.exports = function (MIND) {

  var LOG = MIND.LOG('home')
  var common = MIND.common

  MIND.route.get('/', function (req, res) {
    res.render('home/home')
  }, { no_auth: true })

  MIND.route.get('/profile', function (req, res) {
    res.send({ message: "This will be a profile view." })
  }, { no_auth: true })

  MIND.route.post('/store/:storage_type', function (req, res) {
    var extract = req.body.extract
    var storage_type = request.params.storage_type
    var user_email = (req.current_user || {}).email

    if (user_email) {
      MIND.storage.save({
        user_email: user_email,
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

  MIND.route.post('/storage/status', function (req, res) {
    var extract = req.body.extract
    var user_email = (req.current_user || {}).email

    if (user_email) {
      var file_name = "temporary_fragments_" + common.hashCode(user_email)
      var source_file_path = (storage_dir + "/" + file_name)
      fs.writeFile(target_file_path, extract, function(error) {
        res.send({
          message: (error ? "Unable to write file." : "Memory written.")
        })
      })
    }
    else {
      res.send({ message: "Unable to recognize user." })
    }
  })

  return {}
}
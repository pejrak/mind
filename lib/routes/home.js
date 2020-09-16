
const LOG = require('debug')('mind:home')

module.exports = function({ Router }) {
  const Storage = require('../storage')
  const User = require('../user')
  Router.get('/user', function(req, res) {
    res.send({
      user: req.currentUser
    })
  })

  Router.post('/profile/update', function(req, res) {
    var storage_options = {
      storageKey: req.body.key,
      storageSecret: req.body.secret,
    }

    if (Storage.storageOptionsValid(storage_options)) {
      var email = req.currentUser.email
      User.assignToRecord(email, storage_options, function(errors) {
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

  Router.post('/store/:storageType', function(req, res) {
    var extract = req.body.extract
    var storageType = req.params.storageType
    var userEmail = (req.currentUser || {}).email

    if (userEmail) {
      MIND.storage.save({
        userEmail: userEmail,
        user_record: req.currentUser,
        storageType: storageType,
        content: extract
      }, function(error) {
        res.send({
          message: (error ? "Unable to write file." : "Memory written.")
        })
      })
    }
    else {
      res.send({ message: "Unable to recognize user." })
    }
  })

  Router.get('/storage/status', function(req, res) {
    var userEmail = (req.currentUser || {}).email

    if (userEmail) {
      Storage.check(userEmail, function(errors, source_options) {
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

  Router.get('/storage/load/:storageType', function(req, res) {
    var userEmail = (req.currentUser || {}).email
    var storageType = req.params.storageType

    if (userEmail) {
      MIND.storage.load({
        userEmail: userEmail,
        storageType: storageType
      }, function(errors, content) {
        res.send({
          content,
          message: "Loaded storage.",
          success: !errors,
        })
      })
    } else {
      res.send({
        message: "Login again to access storage options."
      })
    }
  })

  // public endpoint for retrieving content of remoteMind storage type
  // validated by provided email and publicToken
  Router.get('/public/storage/posts', (req, res) => {
    const { email, publicToken } = req.query;
    if (!email || !publicToken) {
      res.status(401).send({ message: 'Missing params' });
      return
    }

    Storage.load({
      userEmail: email,
      storageType: 'remoteMind',
    }, function(errors, contentString) {
      const content = JSON.parse(contentString)
      if (errors) {
        res.status(400).send({ message: 'Cannot load user' })
        return
      }
      if (content.publicToken !== publicToken) {
        res.status(401).send({ message: 'Public token mismatch' })
        return
      }
      res.status(200).json(content.posts)
    })
  }, { noAuth: true })
}

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
    var storageOptions = {
      storageKey: req.body.key,
      storageSecret: req.body.secret,
    }

    if (Storage.storageOptionsValid(storageOptions)) {
      var email = req.currentUser.email
      User.assignToRecord(email, storageOptions, error => {
        LOG('profile update | errors, storage_options:', error, storageOptions)
        res.send({
          success: !error,
          message: (
            error
              ? 'Unable to update profile options.'
              : 'Profile update complete.'
          )
        })
      })
    } else {
      res.send({
        message: 'Invalid storage options.',
        success: false,
      })
    }
  })

  Router.post('/memory/:storageType', function(req, res) {
    const content = req.body.content
    const storageType = req.params.storageType
    const userEmail = (req.currentUser || {}).email

    if (userEmail) {
      Storage.save({
        content,
        storageType: storageType,
        userEmail: userEmail,
        userRecord: req.currentUser,
      }, error => res.send({ success: !error }))
    } else {
      res.send({ message: 'Unable to recognize user.' })
    }
  })

  Router.get('/memory/status', function(req, res) {
    const userEmail = (req.currentUser || {}).email

    if (userEmail) {
      Storage.check(userEmail, function(error, sourceOptions) {
        res.send({
          message: 'Checked storage options.',
          source_options: sourceOptions,
          success: !error,
        })
      })
    } else {
      res.send({
        message: 'Login again to access storage options.',
        source_options: null
      })
    }
  })

  Router.get('/memory/:storageType', function(req, res) {
    var userEmail = (req.currentUser || {}).email
    var storageType = req.params.storageType

    if (userEmail) {
      Storage.load({
        userEmail: userEmail,
        storageType: storageType
      }, function(error, content) {
        res.send({
          content,
          message: 'Loaded storage.',
          success: !error,
        })
      })
    } else {
      res.send({
        message: 'Login again to access storage options.'
      })
    }
  })

  // public endpoint for retrieving content of remoteMind storage type
  // validated by provided email and publicToken
  Router.get('/public/storage/posts', (req, res) => {
    const { email, publicToken } = req.query
    if (!email || !publicToken) {
      res.status(401).send({ message: 'Missing params' })
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

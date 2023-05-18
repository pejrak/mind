import debug from 'debug'
import { check, load, save, storageOptionsValid } from '../storage.js'
import { assignToRecord } from '../user.js'

const LOG = debug('mind:home')

export const home = ({ Router }) => {
  Router.get('/user', (req, res) => {
    LOG('/user', req.currentUser)
    res.send({
      user: {
        autoRecallEnabled: true,
        ...req.currentUser,
      },
    })
  })

  Router.post('/profile/update', async (req, res) => {
    const storageOptions = {
      storageKey: req.body.key,
      storageSecret: req.body.secret,
    }
    if (!storageOptionsValid(storageOptions)) {
      res.send({
        message: 'Invalid storage options.',
        success: false,
      })
    }

    const email = req.currentUser.email
    const success = await assignToRecord(email, storageOptions)
    LOG('profile update | errors, storage_options:', storageOptions)
    res.send({
      success,
      message: success
        ? 'Profile update complete.'
        : 'Unable to update profile options.',
    })
  })

  Router.post('/memory/:storageType', (req, res) => {
    const content = req.body.content
    const storageType = req.params.storageType
    const userEmail = (req.currentUser || {}).email

    if (userEmail) {
      save(
        {
          content,
          storageType,
          userEmail: userEmail,
          userRecord: req.currentUser,
        },
        (error) => res.send({ success: !error }),
      )
    } else {
      res.send({ message: 'Unable to recognize user.' })
    }
  })

  Router.get('/memory/status', (req, res) => {
    const userEmail = (req.currentUser || {}).email

    if (userEmail) {
      check(userEmail, (error, sourceOptions) => {
        res.send({
          message: 'Checked storage options.',
          sourceOptions,
          success: !error,
        })
      })
    } else {
      res.send({
        message: 'Login again to access storage options.',
        sourceOptions: null,
      })
    }
  })

  Router.get('/memory/:storageType', (req, res) => {
    var userEmail = (req.currentUser || {}).email
    var storageType = req.params.storageType

    if (userEmail) {
      load(
        {
          userEmail: userEmail,
          storageType: storageType,
        },
        (error, content) => {
          res.send({
            content,
            message: 'Loaded storage.',
            success: !error,
          })
        },
      )
    } else {
      res.send({
        message: 'Login again to access storage options.',
      })
    }
  })

  // public endpoint for retrieving content of remoteMind storage type
  // validated by provided email and publicToken
  Router.get(
    '/public/storage/posts',
    (req, res) => {
      const { email, publicToken } = req.query
      if (!email || !publicToken) {
        res.status(401).send({ message: 'Missing params' })
        return
      }

      load(
        {
          userEmail: email,
          storageType: 'remoteMind',
        },
        (errors, contentString) => {
          const content = JSON.parse(contentString)
          if (errors) {
            res.status(400).send({ message: 'Cannot load user' })
            return
          }
          if (content.publicToken !== publicToken) {
            res.status(401).send({ message: 'Public token mismatch' })
            return
          }
          res.send(content.posts)
        },
      )
    },
    { noAuth: true },
  )
}

const pathComponentExists = require('../pathComponents/exists')
const debug = require('debug')('mind:pathComponentGet')

module.exports = (req, res) => {
  const { name } = req.query

  debug('query:name', name)
  if (name && name.length > 1) {
    pathComponentExists(name, (error, exists) => res.send({
      success: (!error && exists)
    }))
  } else {
    res.send({
      success: false
    })
  }
}
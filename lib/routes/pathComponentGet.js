const pathComponentExists = require('../pathComponents/exists')

module.exports = (req, res) => {
  const { name } = req.query

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
const debug = require('debug')('mind:route:userKeyPost')
const { assignToRecord } = require('../user')

module.exports = async (req, res) => {
  const {
    currentUser,
    body: { key }
  } = req
  const response = await assignToRecord.promised(currentUser.email, {
    publicKey: key,
  })

  debug('currentUser, key', { currentUser, key, response })
  res.send({
    success: false
  })
}

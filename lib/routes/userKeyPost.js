const debug = require('debug')('mind:route:userKeyPost')
const { assignToRecord } = require('../user')

module.exports = async (req, res) => {
  const {
    currentUser,
    body: { key }
  } = req
  const success = await assignToRecord.promised(currentUser.email, {
    publicKey: key,
  })

  debug('currentUser, key', { currentUser, key, success })
  res.send({
    success,
  })
}

const debug = require('debug')('mind:route:userKeyPut')
const { assignToRecord } = require('../user')

module.exports = async (req, res) => {
  const {
    body: { key },
    currentUser,
  } = req
  const success = await assignToRecord.promised(currentUser.email, {
    publicKey: key,
  })

  debug('currentUser, key', { currentUser, key, success })
  res.send({
    success,
  })
}

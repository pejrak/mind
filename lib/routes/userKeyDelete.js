const debug = require('debug')('mind:route:userKeyDelete')
const { assignToRecord } = require('../user')

module.exports = async (req, res) => {
  const { currentUser } = req
  const success = await assignToRecord.promised(currentUser.email, {
    publicKey: '',
  })

  debug('after', { currentUser, success })
  res.send({
    success,
  })
}

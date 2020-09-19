const debug = require('debug')('mind:route:userKeyPost')
const { assignToRecord } = require('../user')
const {
  generatePublicKey,
  encryptWithPublicKey,
} = require('../utilities/pgp')
const Crypto = require('../utilities/crypto')

module.exports = async (req, res) => {
  const {
    body: { secret },
    currentUser,
  } = req

  const {
    privateKey,
    publicKey,
  } = await generatePublicKey(secret)
  const privateKeyEncrypted = Crypto.encrypt({
    secret,
    text: privateKey,
  })
  const success = await assignToRecord.promised(currentUser.email, {
    privateKeyEncrypted,
    publicKey,
  })
  const encryptedTestString = await encryptWithPublicKey({
    publicKey,
    text: 'test'
  })

  debug('success', success)
  res.send({
    encryptedTestString,
    privateKeyEncrypted,
    publicKey,
    success,
  })
}

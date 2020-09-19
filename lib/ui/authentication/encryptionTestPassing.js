const Crypto = require('../../utilities/crypto')
const PgpUtil = require('../../utilities/pgp')

export const encryptionTestPassing = async ({
  encryptedTestString,
  privateKeyEncrypted,
  publicKey,
  secret,
}) => {
  const privateKey = Crypto.decrypt({
    secret,
    text: privateKeyEncrypted,
  })
  const decrypted = await PgpUtil.decryptWithPrivateKey({
    privateKey,
    publicKey,
    secret,
    text: encryptedTestString,
  })

  console.info({ privateKey, decrypted })

  return (decrypted === 'test')
}

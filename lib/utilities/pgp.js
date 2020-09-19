const PGP = require('openpgp')

exports.generatePublicKey = async ({
  secret,
  userEmail,
  userFullName,
}) => {
  const {
    privateKeyArmored,
    publicKeyArmored,
    revocationCertificate,
  } = await PGP.generateKey({
    passphrase: secret,
    rsaBits: 4096,
    userIds: [{ name: userFullName, email: userEmail }]
  })

  return {
    privateKey: privateKeyArmored,
    publicKey: publicKeyArmored,
    revocationCertificate,
  }
}

exports.encryptWithPublicKey = async ({ publicKey, text }) => {
  const { keys: [publicKeyRead] } = await PGP.key.readArmored(publicKey)
  const { data: encrypted } = await PGP.encrypt({
    message: PGP.message.fromText(text),
    publicKeys: [publicKeyRead],
  })

  return encrypted
}

exports.decryptWithPrivateKey = async ({
  privateKey,
  publicKey,
  // secret,
  text
}) => {
  const {
    keys: [privateKeyRead]
  } = await PGP.key.readArmored(privateKey)
  const {
    keys: [publicKeyRead]
  } = await PGP.key.readArmored(publicKey)
  const { data: decrypted } = await PGP.decrypt({
    message: (await PGP.message.readArmored(text)),
    privateKeys: [privateKeyRead],
    publicKeys: [publicKeyRead],
  })

  return decrypted
}

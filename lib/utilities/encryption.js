const crypto = require('crypto')
const defaultAlgorithm = 'aes-256-cbc'

function stringBuffer(str, encoding = 'hex') {
  return Buffer.from(str, encoding)
}

module.exports = (encryptionKey, {
  algorithm = defaultAlgorithm
} = {}) => {
  const IV_LENGTH = 16 // For AES, this is always 16
  const hash = crypto.createHash('sha256')

  hash.update(encryptionKey)

  const ENCRYPTION_KEY = hash.digest() // Must be 256 bytes (32 characters)

  function encrypt(text) {
    const iv = crypto.randomBytes(IV_LENGTH)
    const cipher = crypto.createCipheriv(
      algorithm, stringBuffer(ENCRYPTION_KEY), iv
    )
    let encrypted = cipher.update(text)

    encrypted = Buffer.concat([encrypted, cipher.final()])

    const result = iv.toString('hex') + ':' + encrypted.toString('hex')

    return result
  }

  function decrypt(text) {
    const textParts = text.split(':')
    const iv = stringBuffer(textParts.shift(), 'hex')
    const encryptedText = stringBuffer(textParts.join(':'), 'hex')
    const decipher = crypto.createDecipheriv(
      algorithm, stringBuffer(ENCRYPTION_KEY), iv
    )
    let decrypted = decipher.update(encryptedText)

    decrypted = Buffer.concat([decrypted, decipher.final()])
    return decrypted.toString()
  }

  return {
    decrypt,
    encrypt,
  }
}

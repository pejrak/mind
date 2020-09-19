const SJCL = require('sjcl')

module.exports = {
  decrypt({ text, secret }) {
    const decrypted = SJCL.decrypt(secret, text)

    return decrypted
  },
  encrypt({ text, secret }) {
    const encrypted = SJCL.encrypt(secret, text)

    console.log('encrypted', encrypted)

    return encrypted
  },
}

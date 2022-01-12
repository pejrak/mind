const { promisify } = require('util')
const FsAccess = promisify(require('fs').access)

/** Returns statistics of the given file
 * @param { String } file
 * @returns { Object }
 */
async function pathExists(file) {
  try {
    await FsAccess(file)
    return true
  } catch (error) {
    return false
  }
}

module.exports = pathExists

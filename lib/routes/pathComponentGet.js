import logger from 'debug'
import { pathComponentExists } from '../pathComponents/exists.js'

const debug = logger('mind:pathComponentGet')

export const pathComponentGet = async (req, res) => {
  const { name } = req.query
  debug('query:name', name)
  const exists = await pathComponentExists(name)
  res.send({ success: exists })
}

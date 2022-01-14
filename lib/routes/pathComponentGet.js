import logger from 'debug'
import { pathComponentExists } from '../pathComponents/exists.js'

const debug = logger('mind:pathComponentGet')

export const pathComponentGet = (req, res) => {
  const { name } = req.query
  debug('query:name', name)
  if (name && name.length > 1) {
    pathComponentExists(name, (error, exists) => res.send({
      success: (!error && exists)
    }))
  } else {
    res.send({
      success: false
    })
  }
}

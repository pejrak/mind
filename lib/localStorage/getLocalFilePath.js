import { resolve } from 'path'
import { config } from '../../config/index.js'
import { getLocalFileName } from './getLocalFileName.js'

export function getLocalFilePath(email) {
  return resolve(config.storageDirectory, getLocalFileName(email))
}

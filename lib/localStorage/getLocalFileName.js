import { hashCode } from '../common.js'

export function getLocalFileName(userEmail) {
  return 'temporary_fragments_' + hashCode(userEmail)
}

import { config } from '../../config/index.js'
import { client } from '../db/redis.js'

const KEY = `${config.name.toUpperCase()}:nouns`

export const pathComponentExists = async (query) => {
  const response = await client.sIsMember(
    KEY,
    query,
  )

  return response === 1
}

import { config } from '../../config/index.js'
import { client } from '../db/redis.js'

const KEY = `${config.name.toUpperCase()}:nouns`

export const pathComponentExists = function(query, done) {
  client.sismember(
    KEY,
    query,
    (error, response) => done(error, (response === 1))
  )
}

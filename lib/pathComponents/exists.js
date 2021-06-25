const Config = require('../../config')
const redis = require('redis')
const db = redis.createClient()
const KEY = `${Config.name.toUpperCase()}:nouns`

function checkIfExists(query, done) {
  db.sismember(
    KEY,
    query,
    (error, response) => done(error, (response === 1))
  )
}

module.exports = checkIfExists

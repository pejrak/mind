const Config = require('../../config')
var redis = require("redis")
var db = redis.createClient()
var KEY = `${Config.name.toUpperCase()}:nouns`

function checkIfExists(query, done) {
  db.sismember(
    KEY,
    query,
    (error, response) => done(error, (response === 1))
  )
}

module.exports = checkIfExists
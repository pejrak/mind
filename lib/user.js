const Config = require('../config')
const redis = require('redis')
const async = require('async')
const db = redis.createClient(6379)
const debug = require('debug')('mind:user')
const Transforms = require('./utilities/transforms')
const { promisify } = require('util')
const RECORD_PFX = `${Config.name}_user:`
const USER_LIST = `${Config.name}:users`
const ATRRIBUTES = [
  { name: 'email', type: 'string' },
  { name: 'addedAt', type: 'integer' },
  { name: 'updatedAt', type: 'integer' },
  { name: 'publicKey', type: 'string' },
  { name: 'storageKey', type: 'string' },
  { name: 'storageSecret', type: 'string' },
  { name: 'storageType', type: 'string' }
]

// Using function returing object instead of prototypal inheritance
// to avoid declarations of this and that
const User = function(email) {
  const now = Date.now()
  const recordKey = (RECORD_PFX + email)
  const self = {
    load,
    record: {
      name: recordKey,
      email: email,
      addedAt: now,
      updatedAt: now,
      publicKey: 'none',
      storageKey: 'empty',
      storageSecret: 'empty',
      storageType: 'none',
    },
  }

  // Functions we may export or not
  function assign(property, value, persist) {
    self.record[property] = value
    if (persist && typeof persist === 'function') {
      db.hset(recordKey, property, value, persist)
    }
  }

  function assignFrom(hash) {
    ATRRIBUTES.forEach(function(attr) {
      var attribute = attr.name
      var value = hash[attribute]

      if (value) {
        var toAssign = value
        var transformFn = Transforms[attr.type]

        if (transformFn) {
          toAssign = transformFn(value)
        }
        assign(attribute, toAssign)
      }
    })
  }

  // Create and persist record
  function createRecord(done) {
    var record = {}

    ATRRIBUTES.forEach(function(attr) {
      record[attr.name] = self.record[attr.name]
    })
    async.series([
      next => db.hmset(recordKey, record, next),
      next => db.sadd(USER_LIST, email, next),
    ], done)
  }

  function load(done) {
    debug('load', email)
    db.hgetall(recordKey, (error, record) => {
      if (record && record.email) {
        assignFrom(record)
        return done(error)
      } else {
        return createRecord(done)
      }
    })
  }

  // Return myself
  return self
}

function assignToRecord(email, options, done) {
  const user = User(email)

  db.hmset(user.record.name, options, done)
}

assignToRecord.promised = promisify(assignToRecord)

function loadRecord(email, done) {
  const user = User(email)

  user.load(error => done(error, user.record))
}

module.exports = {
  assignToRecord,
  loadRecord,
}

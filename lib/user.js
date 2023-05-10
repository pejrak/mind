import async from 'async'
import { createClient } from 'redis'
import { config } from '../config/index.js'
import { transforms } from './utilities/transforms.js'
import { promisify } from 'util'
import debug from 'debug'

const db = createClient(6379)
const LOG = debug('mind:user')
const RECORD_PFX = `${config.name}_user:`
const USER_LIST = `${config.name}:users`
const ATRRIBUTES = [
  { name: 'email', type: 'string' },
  { name: 'addedAt', type: 'integer' },
  { name: 'updatedAt', type: 'integer' },
  { name: 'storageKey', type: 'string' },
  { name: 'storageSecret', type: 'string' },
  { name: 'storageType', type: 'string' }
]

// Using function returing object instead of prototypal inheritance
// to avoid declarations of this and that
export const User = function(email) {
  const now = Date.now()
  const recordKey = (RECORD_PFX + email)
  const self = {
    load,
    record: {
      name: recordKey,
      email: email,
      addedAt: now,
      updatedAt: now,
      publicKey: '',
      privateKeyEncrypted: '',
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
        var transformFn = transforms[attr.type]

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
    db.hgetall(recordKey, (error, record) => {
      LOG('load', email, record)
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

export function assignToRecord(email, options, done) {
  const user = User(email)

  db.hmset(
    user.record.name, options,
    (error, response) => done(error, response === 'OK')
  )
}

assignToRecord.promised = promisify(assignToRecord)

export function loadRecord(email, done) {
  const user = User(email)

  user.load(error => done(error, user.record))
}

import { client as db } from './db/redis.js'
import { config } from '../config/index.js'
import { transforms } from './utilities/transforms.js'
import debug from 'debug'

const LOG = debug('mind:user')
const RECORD_PFX = `${config.name}_user:`
const USER_LIST = `${config.name}:users`
const ATRRIBUTES = [
  { name: 'email', type: 'string' },
  { name: 'addedAt', type: 'integer' },
  { name: 'updatedAt', type: 'integer' },
  { name: 'storageKey', type: 'string' },
  { name: 'storageSecret', type: 'string' },
  { name: 'storageType', type: 'string' },
]

// Using function returing object instead of prototypal inheritance
// to avoid declarations of this and that
export const User = (email) => {
  const now = Date.now()
  const recordKey = RECORD_PFX + email
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
  async function assign({ property, value, persist = false }) {
    self.record[property] = value
    if (persist) {
      await db.hSet(recordKey, property, value)
    }
    return true
  }

  function assignFrom(hash) {
    ATRRIBUTES.forEach((attr) => {
      var attribute = attr.name
      var value = hash[attribute]

      if (value) {
        var toAssign = value
        var transformFn = transforms[attr.type]

        if (transformFn) {
          toAssign = transformFn(value)
        }
        assign({ property: attribute, value: toAssign })
      }
    })

    return hash
  }

  // Create and persist record
  async function createRecord() {
    const record = {}

    ATRRIBUTES.forEach((attr) =>
      Object.assign(record, { [attr.name]: self.record[attr.name] }),
    )

    await db.hSet(recordKey, ...Object.entries(record))
    await db.sAdd(USER_LIST, email)
  }

  async function load() {
    const record = await db.hGetAll(recordKey)
    LOG('load', email, record)
    if (record && record.email) {
      return assignFrom(record)
    } else {
      return createRecord()
    }
  }

  // Return myself
  return self
}

export async function assignToRecord(email, options, done) {
  const user = User(email)

  const response = await db.hSet(
    user.record.name,
    ...Object.entries(options),
  )
  return response === 'OK'
}

export async function loadRecord(email) {
  const user = User(email)
  await user.load()

  return user.record
}

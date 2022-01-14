import { config } from '../config/index.js'
import Dropbox from 'dropbox'
import async from 'async'
import fs from 'fs'
import { hashCode } from './common.js'

function getLocalFileName(userEmail) {
  return ('temporary_fragments_' + hashCode(userEmail))
}

function getLocalFilePath(userEmail) {
  return (config.storageDirectory + '/' + getLocalFileName(userEmail))
}

export function save({
  content,
  storageType,
  userEmail,
  userRecord,
}, done) {
  if (storageType === 'remoteMind') {
    fs.writeFile(getLocalFilePath(userEmail), content, done)
  } else if (
    storageType === 'remoteDropbox' &&
    userRecord.storageKey &&
    userRecord.storageSecret
  ) {
    return saveToDropbox({
      userEmail,
      userRecord,
    }, done)
  }
}

function saveToDropbox(options, done) {
  var key = options.user_record.storageKey
  var secret = options.user_record.storageSecret
  var client = new Dropbox.Client({
    key: key,
    secret: secret
  })

  async.series([
    next => {
      client.authDriver(new Dropbox.AuthDriver.NodeServer(3000))
      return client.authenticate(next)
    },
    next => client.getAccountInfo(next)
  ], done)
}

export function load(options, done) {
  var userEmail = options.userEmail
  var storageType = options.storageType
  var filePath = getLocalFilePath(userEmail)

  if (storageType === 'remoteMind') {
    fs.readFile(filePath, (error, data) => done(error, `${data}`))
  } else return done()
}

export function storageOptionsValid(options) {
  return (
    options.storageKey && options.storageKey.length &&
    options.storageKey.length < 100 &&
    options.storageSecret && options.storageSecret.length &&
    options.storageSecret.length < 100
  )
}

export function check(userEmail, done) {
  async.parallel({
    remoteMind: function(next) {
      checkLocalStore(userEmail, next)
    },
    remoteDropbox: function(next) {
      return next()
    }
  }, done)
}

function checkLocalStore(userEmail, done) {
  // eslint-disable-next-line node/no-deprecated-api
  fs.exists(getLocalFilePath(userEmail), exists => done(null, exists))
}

// User controller

module.exports = function (MIND) {

  var redis = require('redis')
  var async = require('async')
  var db = redis.createClient(6379)
  // Constants
  var RECORD_PFX = MIND.name + "_user:"
  var USER_LIST = MIND.name + ":users"
  var ATRRIBUTES = [
        { name: "email", type: "string" },
        { name: "added_at", type: "integer" },
        { name: "updated_at", type: "integer" },
        { name: "storage_key", type: "string" },
        { name: "storage_secret", type: "string" },
        { name: "storage_type", type: "string" }
      ]
  var LOG = MIND.LOG("user")

  // Using function returing object instead of prototypal inheritance
  // to avoid declarations of this and that
  var User = function (email) {
    var now = Date.now()
    var record_name = (RECORD_PFX + email)
    var self = {
          record: {
            name: record_name,
            email: email,
            added_at: now,
            updated_at: now,
            storage_key: "empty",
            storage_secret: "empty",
            storage_type: "none"
          },
          load: load
        }

    // Functions we may export or not
    function assign(property, value, persist) {
      self.record[property] = value
      if (persist && typeof(persist) === "function") {
        db.hset(record_name, property, value, persist)
      }
    }

    function assignFrom(hash) {
      ATRRIBUTES.forEach(function (attr) {
        var attr_name = attr.name
        var value = hash[attr_name]

        if (value) {
          var value_to_assign = value
          var transformFn = MIND.common.transforms[attr.type]
          
          if (transformFn) {
            value_to_assign = transformFn(value)
          }
          assign(attr_name, value_to_assign)
        }
      })
    }

    // Create and persist record
    function createRecord(done) {
      var hash_to_record = {}

      ATRRIBUTES.forEach(function (attr) {
        var attr_name = attr.name
        hash_to_record[attr_name] = self.record[attr.name]
      })
      async.series([
        function (next) {
          db.hmset(record_name, hash_to_record, next)
        },
        function (next) {
          db.sadd(USER_LIST, email, next)
        }
      ], done)
    }

    function load(done) {
      db.hgetall(record_name, function (error, record_hash) {
        if (record_hash && record_hash.email) {
          assignFrom(record_hash)
          return done(error)
        }
        else {
          return createRecord(done)
        }
      })
    }

    // Return myself
    return self
  }

  function assignToRecord(email, options, done) {
    var user = User(email)

    db.hmset(user.record.name, options, done)
  }

  function loadRecord(email, done) {
    var user = User(email)

    user.load(function (error) {
      return done(null, user.record)
    })
  }

  return {
    loadRecord: loadRecord,
    assignToRecord: assignToRecord
  }
}
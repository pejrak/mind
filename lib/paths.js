module.exports = function (MIND) {

  var redis = require("redis")
  var db = redis.createClient()
  var COMPONENTS_REPO = "MIND:nouns" 

  function checkIfExists(query, done) {
  	db.sismember(COMPONENTS_REPO, query, function(error, response) {
  	  return done(error, (response === 1))
  	})
  }

  return {
  	checkIfExists: checkIfExists
  }
}
// routing plugin
module.exports = function(MIND) {
  var me = {}
  var authenticate = MIND.auth.ensure
  var checkAuthenticationStatus = MIND.auth.status
  var METHODS = ['get', 'post', 'put']
  var LOG = MIND.common.LOG('route')

  // Assign available methods to routing
  METHODS.forEach(function(method) {

    me[method] = function(path, execution, options) {
      // Read passed options if passed,
      // make sure to authenticate if not otherwise specified
      options = (options || {
        // Default options

        // To ensure we authenticate by default
        noAuthentication: false
      })

      if (!options.noAuthentication) {
        MIND.app[method](path, authenticate, execution)
      }
      else {
        MIND.app[method](path, checkAuthenticationStatus, execution)
      }
    }
  })

  return me

}
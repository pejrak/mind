const METHODS = ['get', 'post', 'put', 'delete']
// routing plugin
module.exports = ({ app, Authentication }) => {
  const self = {}

  // Assign available methods to routing
  METHODS.forEach(method => {
    self[method] = (
      path, execution, { noAuth = false } = {}
    ) => {
      // Read passed options if passed,
      // make sure to authenticate if not otherwise specified
      if (!noAuth) {
        app[method](path, Authentication.ensure, execution)
      } else {
        app[method](path, Authentication.status, execution)
      }
    }
  })

  return self
}

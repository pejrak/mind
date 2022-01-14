const METHODS = ['get', 'post', 'put', 'delete']
// routing plugin
export const router = ({ app, Authentication }) => {
  const self = {}
  // Assign available methods to routing
  METHODS.forEach(method => {
    self[method] = (
      path, execution, { noAuth = false } = {}
    ) => app[method](path, !noAuth ? Authentication.ensure : Authentication.status, execution)
  })

  return self
}

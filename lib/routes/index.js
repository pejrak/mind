const Home = require('./home')

module.exports = ({
  app
}) => {
  const Authentication = require('../auth')({ app })
  const Router = require('./router')({ app, Authentication })

  // First register authentication routes
  Authentication.init()
  Router.get('/component', require('./pathComponentGet'), { noAuth: true })
  Home({ Router })
}

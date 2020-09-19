const Home = require('./home')

module.exports = ({
  app
}) => {
  const Authentication = require('../auth')({ app })
  const Router = require('./router')({ app, Authentication })

  // First register authentication routes
  Authentication.init()
  Router.get('/component', require('./pathComponentGet'), { noAuth: true })
  Router.post('/user/key', require('./userKeyPost'))
  Router.put('/user/key', require('./userKeyPut'))
  Router.delete('/user/key', require('./userKeyDelete'))
  Home({ Router })
}

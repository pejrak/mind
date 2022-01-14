import { home } from './home.js'
import { init as initAuthentication } from '../auth/index.js'
import { router } from './router.js'
import { pathComponentGet } from './pathComponentGet.js'

export const routes = ({
  app
}) => {
  const Authentication = initAuthentication({ app })
  const Router = router({ app, Authentication })

  Authentication.init()
  Router.get('/component', pathComponentGet, { noAuth: true })
  home({ Router })
}

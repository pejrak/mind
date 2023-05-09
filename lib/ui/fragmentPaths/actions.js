import server from '../server'

export const fragmentPathComponentExists = name => server.get(
  '/component', {
    params: { name }
  }
)

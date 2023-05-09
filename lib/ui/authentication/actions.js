import server from '../server'

export const getCurrentUser = () => server.get('/user')

import Axios from 'axios'

export const getCurrentUser = () => Axios.get('/user')
export const importCurrentUserKey = key => Axios.post(
  '/user/key', { key }
)

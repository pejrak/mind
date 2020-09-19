import Axios from 'axios'

export const getCurrentUser = () => Axios.get('/user')
export const importCurrentUserKey = key => Axios.put(
  '/user/key', { key }
)
export const generateCurrentUserKey = secret => Axios.post(
  '/user/key', { secret }
)
export const deleteCurrentUserKey = () => Axios.delete(
  '/user/key'
)

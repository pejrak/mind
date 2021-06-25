import Axios from 'axios'

export const getCurrentUser = () => Axios.get('/user')

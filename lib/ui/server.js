import axios from 'axios'
import { token, tokenAuthKey, tokenUserKey } from './auth/token'
import { serverUrl } from './constants'
import { log } from './utilities/log'

const logger = log('ui:server')

const assignInterceptors = (axiosInstance) => {
  axiosInstance.interceptors.request.use(function beforeRequest(
    config,
  ) {
    config.headers['x-authentication-token'] =
      token(tokenAuthKey).get()
    config.headers['x-authentication-requestor'] =
      token(tokenUserKey).get()

    return config
  })

  axiosInstance.interceptors.response.use(null, (error) => {
    if (AUTH_FAILURE_CODES.includes(error.response?.status)) {
      logger.warn(
        'Authentication failure, redirecting to login',
        error.response,
      )
      window.location = `/login?e=${error.response?.status}`
      return
    }
    return Promise.reject(error)
  })
}

const server = axios.create({
  baseURL: `${serverUrl}`,
})

assignInterceptors(server)

export { server }
export default server

export const AUTH_FAILURE_CODES = [401, 403]

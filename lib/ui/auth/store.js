import { log } from '../utilities/log.js'
import { getCurrentUser } from './actions.js'

const logger = log('store:authentication')

export const Authentication = {
  state: {
    authenticated: false,
    authenticating: false,
    userEmail: null,
    userFullName: null,
  },
  getters: {
    isAuthenticated: ({ authenticated, userEmail }) => (
      authenticated && typeof userEmail === 'string'
    ),
    userEmailSnake: ({
      userEmail
    }) => (
      userEmail ? userEmail.replace(/[^a-z0-9]/gi, '_') : 'unknown'
    ),
  },
  actions: {
    async getUser({ commit }) {
      const response = await getCurrentUser()
      const user = response?.data.user
      logger.info('user', user)
      if (user) {
        commit('setUser', user)
      }
    },
  },
  mutations: {
    setUser(state, {
      email,
      fullName,
    }) {
      state.authenticated = true
      state.authenticating = false
      state.userEmail = email
      state.userFullName = fullName
    },
  },
}

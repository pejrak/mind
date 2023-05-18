import { log } from '../utilities/log.js'
import { getCurrentUser } from './actions.js'

const logger = log('store:authentication')

export const Authentication = {
  state: {
    authenticated: false,
    authenticating: false,
    autoRecallEnabled: false,
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
    async getUser({ commit, dispatch }) {
      const response = await getCurrentUser()
      const user = response?.data.user
      logger.info('user', user)
      if (user) {
        commit('setUser', user)
        dispatch('postAuthentication')
      }
    },
    postAuthentication({ dispatch, state }) {
      if (state.autoRecallEnabled) {
        dispatch('fragments/load', null, { root: true })
      }
    }
  },
  mutations: {
    setUser(state, {
      autoRecallEnabled,
      email,
      fullName,
    }) {
      state.authenticated = true
      state.authenticating = false
      state.autoRecallEnabled = !!autoRecallEnabled
      state.userEmail = email
      state.userFullName = fullName
    },
  },
}

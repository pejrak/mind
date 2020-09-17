import {
  getCurrentUser,
  importCurrentUserKey,
} from './actions'

export const Authentication = {
  state: {
    authenticated: false,
    authenticating: false,
    userEmail: null,
    userFullName: null,
    userPublicKey: null,
  },
  getters: {
    hasExtractionSetup: ({ userPublicKey }) => (
      typeof userPublicKey === 'string' &&
      userPublicKey.length > 0
    ),
    isAuthenticated: ({ authenticated, userEmail }) => (
      authenticated && typeof userEmail === 'string'
    ),
  },
  actions: {
    async getUser({ commit }) {
      const { data: { user } } = await getCurrentUser()

      console.info('getUser', user)
      commit('user', user)
    },
    async importKey({ commit, getters }, key) {
      if (getters.isAuthenticated) {
        const { data: { success } } = await importCurrentUserKey(key)
        console.info('importKey', { key, success })
        if (!success) return
      }
      commit('setKey', key)
    },
  },
  mutations: {
    setKey(state, payload) {
      state.userPublicKey = payload
    },
    user(state, { email, fullName, publicKey = '' }) {
      state.authenticated = true
      state.authenticating = false
      state.userEmail = email
      state.userFullName = fullName
      state.userPublicKey = publicKey
    }
  },
}

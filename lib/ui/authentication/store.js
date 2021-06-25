import {
  getCurrentUser,
} from './actions'

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
      const { data: { user } } = await getCurrentUser()
      commit('setUser', user)
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

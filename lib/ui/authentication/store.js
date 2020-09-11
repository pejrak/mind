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
  },
  actions: {
    async getUser({ commit }) {
      const { data: { user } } = await getCurrentUser()

      console.info('getUser', user)
      commit('user', user)
    },
  },
  mutations: {
    user(state, { email, fullName }) {
      state.authenticated = true
      state.authenticating = false
      state.userEmail = email
      state.userFullName = fullName
    }
  },
}

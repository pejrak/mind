import {
  deleteCurrentUserKey,
  generateCurrentUserKey,
  getCurrentUser,
  importCurrentUserKey,
} from './actions'
import { encryptionTestPassing } from './encryptionTestPassing'

export const Authentication = {
  state: {
    authenticated: false,
    authenticating: false,
    userEmail: null,
    userFullName: null,
    userPublicKey: null,
    userPrivateKey: null,
  },
  getters: {
    hasExtractionSetup: ({ userPublicKey }) => (
      typeof userPublicKey === 'string' &&
      userPublicKey.length > 10
    ),
    isAuthenticated: ({ authenticated, userEmail }) => (
      authenticated && typeof userEmail === 'string'
    ),
  },
  actions: {
    async deletePublicKey({ commit }) {
      const { data: { success } } = await deleteCurrentUserKey()

      if (success) {
        commit('setPublicKey', '')
      }
    },
    async getUser({ commit }) {
      const { data: { user } } = await getCurrentUser()

      commit('user', user)
    },
    async importKey({ commit, getters }, key) {
      if (getters.isAuthenticated) {
        const { data: { success } } = await importCurrentUserKey(key)
        console.info('importKey', { key, success })
        if (!success) return false
      }
      commit('setPublicKey', key)
      return true
    },
    async generateKey({ commit, dispatch, getters }, secret) {
      const {
        data: {
          encryptedTestString,
          success,
          publicKey,
          privateKeyEncrypted,
        }
      } = await generateCurrentUserKey(secret)

      const passing = await encryptionTestPassing({
        encryptedTestString,
        privateKeyEncrypted,
        publicKey,
        secret,
      })

      console.log('encryptedTestString', {
        encryptedTestString,
        passing,
      })
      if (success) {
        if (getters.isAuthenticated) {
          await dispatch('getUser')
        } else {
          commit('setPublicKey', publicKey)
          commit('setPrivateKey', privateKeyEncrypted)
        }
      }
      return success
    },
  },
  mutations: {
    setPublicKey(state, payload) {
      console.info('setPublicKey')
      state.userPublicKey = payload
    },
    setPrivateKey(state, payload) {
      console.info('setPrivateKey')
      state.userPrivateKey = payload
    },
    user(state, {
      email,
      fullName,
      publicKey = '',
      privateKeyEncrypted = ''
    }) {
      state.authenticated = true
      state.authenticating = false
      state.userEmail = email
      state.userFullName = fullName
      state.userPublicKey = publicKey
      state.userPrivateKey = privateKeyEncrypted
    }
  },
}

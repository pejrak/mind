import { decrypt } from '../../utilities/crypto'
import { decryptWithPrivateKey, encryptWithPublicKey } from '../../utilities/pgp'
import {
  deleteCurrentUserKey,
  generateCurrentUserKey,
  getCurrentUser,
  importCurrentUserKey,
} from './actions'
import { encryptionTestPassing } from './encryptionTestPassing'

const TEST_STRING = 'test'

export const Authentication = {
  state: {
    authenticated: false,
    authenticating: false,
    secret: '',
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
    secretIsSet: ({ secret }) => (secret.length > 0),
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
      commit('setUser', user)
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
          publicKey,
          privateKeyEncrypted,
          success,
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
    async testEncryption({ state }) {
      const privateKey = decrypt({
        secret: state.secret,
        text: state.userPrivateKey,
      })
      const encryptedTestString = await encryptWithPublicKey({
        publicKey: state.userPublicKey,
        text: TEST_STRING,
      })
      const decryptedTestString = await decryptWithPrivateKey({
        privateKey: privateKey,
        publicKey: state.userPublicKey,
        text: encryptedTestString,
      })

      return (decryptedTestString === TEST_STRING)
    }
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
    setSecret(state, payload) {
      state.secret = payload
    },
    setUser(state, {
      email,
      fullName,
      publicKey = '',
      privateKeyEncrypted = ''
    }) {
      console.info('setUser')
      state.authenticated = true
      state.authenticating = false
      state.userEmail = email
      state.userFullName = fullName
      state.userPublicKey = publicKey
      state.userPrivateKey = privateKeyEncrypted
    }
  },
}

import { pathsMatching } from '../fragments/pathsMatching'
import { trustIsValid } from './trustIsValid'

export const Trusts = {
  state: {
    outgoing: [],
    incoming: [],
  },
  getters: {
    outgoingOn: (state) => (path) =>
      state.outgoing.filter((t) =>
        pathsMatching({ path, parent: t.path }),
      ),
  },
  mutations: {
    trust(state, { recipient, path }) {
      if (trustIsValid({ recipient, path })) {
        state.outgoing = [
          ...state.outgoing,
          {
            recipient,
            path,
          },
        ]
      }
    },
    untrust(state, { recipient, path }) {
      if (trustIsValid({ recipient, path })) {
        const idx = state.outgoing.findIndex(
          (t) =>
            t.recipient === recipient &&
            pathsMatching({ path, parent: t.path }),
        )

        if (idx > -1) {
          const newOutgoing = [...state.outgoing]
          newOutgoing.splice(idx, 1)
          state.outgoing = newOutgoing
        }
      }
    },
    import(state, payload = []) {
      state.outgoing = [...payload].filter(trustIsValid)
    },
  },
  actions: {
    addTrust({ commit, dispatch }, trust) {
      commit('trust', trust)
      dispatch('onUpdate')
    },
    removeTrust({ commit, dispatch }, trust) {
      commit('untrust', trust)
      dispatch('onUpdate')
    },
    reset({ commit, dispatch }) {
      commit('import', [])
      dispatch('onUpdate')
    },
    onUpdate({ commit }) {
      commit('fragments/updatedAt', Date.now(), { root: true })
    },
  },
}

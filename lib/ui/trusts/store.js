export const Trusts = {
  state: {
    outgoing: [],
    incoming: [],
  },
  getters: {},
  mutations: {
    accept(state, { userEmail, path }) {
      state.incoming = [...state.incoming, { userEmail, path }]
    },
    issue(state, { userEmail, path }) {
      state.outgoing = [...state.outgoing, { userEmail, path }]
    },
    import(_context, trusts = []) {
      console.info('trusts', trusts)
    },
  },
  actions: {},
}

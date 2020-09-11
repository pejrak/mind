export const Fragments = {
  state: {
    newFragmentText: '',
  },
  getters: {
    newFragmentTextIsEmpty: ({ newFragmentText }) => (
      newFragmentText === ''
    ),
    newFragmentTextIsValid: ({ newFragmentText }) => (
      typeof newFragmentText === 'string' &&
      newFragmentText.length > 1
    ),
  },
  mutations: {
    setNewFragmentText(state, payload = '') {
      state.newFragmentText = payload
    }
  }
}

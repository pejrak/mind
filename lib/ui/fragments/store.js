import { generateMockFragments } from './generateMockFragments'
import { fragmentMatchingSearch } from './fragmentMatchingSearch'

export const Fragments = {
  state: {
    newFragmentText: '',
    memorized: generateMockFragments(20),
    searchQuery: '',
  },
  getters: {
    displayedFragments: ({ memorized, searchQuery }) => (
      (searchQuery && searchQuery.length > 1)
        ? memorized.filter(fragment => fragmentMatchingSearch({
          fragment,
          query: searchQuery,
        }))
        : [ ...memorized ]
    ),
    newFragmentTextIsEmpty: ({ newFragmentText }) => (
      newFragmentText === ''
    ),
    newFragmentTextIsValid: ({ newFragmentText }) => (
      typeof newFragmentText === 'string' &&
      newFragmentText.length > 1
    ),
  },
  actions: {
    async submitNewFragment({ commit, state, rootState }) {
      commit('addFragment', {
        owner: rootState['authentication/userEmail'],
        path: rootState['fragmentPaths/selectedFragmentPath'],
        text: state.newFragmentText,
      })
      commit('setNewFragmentText')
    },
  },
  mutations: {
    addFragment(state, { owner, text, path }) {
      const newFragment = {
        createdAt: Date.now(),
        notes: [],
        owner,
        path,
        text,
        updatedAt: Date.now(),
      }
      console.info('addFragment', newFragment)
      state.memorized = [
        newFragment,
        ...state.memorized
      ]
    },
    setNewFragmentText(state, payload = '') {
      state.newFragmentText = payload
    },
    setSearchQuery(state, payload = '') {
      state.searchQuery = payload
    },
  }
}

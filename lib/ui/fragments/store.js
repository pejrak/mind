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
  mutations: {
    setNewFragmentText(state, payload = '') {
      state.newFragmentText = payload
    },
    setSearchQuery(state, payload = '') {
      state.searchQuery = payload
    },
  }
}

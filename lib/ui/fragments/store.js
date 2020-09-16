import { generateMockFragments } from './generateMockFragments'
import { fragmentMatchingSearch } from './fragmentMatchingSearch'

export const Fragments = {
  state: {
    newFragmentText: '',
    newFragmentNoteText: '',
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
        : memorized.filter(({ forgotten }) => !forgotten)
    ),
    newFragmentTextIsEmpty: ({ newFragmentText }) => (
      newFragmentText === ''
    ),
    newFragmentTextIsValid: ({ newFragmentText }) => (
      typeof newFragmentText === 'string' &&
      newFragmentText.length > 1
    ),
    newFragmentNoteTextIsEmpty: ({ newFragmentNoteText }) => (
      newFragmentNoteText === ''
    ),
    newFragmentNoteTextIsValid: ({ newFragmentNoteText }) => (
      typeof newFragmentNoteText === 'string' &&
      newFragmentNoteText.length > 1
    ),
  },
  actions: {
    async forgetFragment({
      commit,
    }, fragmentId) {
      commit('forget', fragmentId)
    },
    async submitNewFragment({
      commit,
      rootState,
      state,
    }) {
      console.log('rootState', rootState)
      commit('addFragment', {
        owner: rootState.authentication.userEmail,
        path: rootState.fragmentPaths.selectedFragmentPath,
        text: state.newFragmentText,
      })
      commit('setNewFragmentText')
    },
    async submitNewFragmentNote({
      commit,
      state,
    }, fragmentId) {
      commit('addFragmentNote', {
        fragmentId,
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
    addFragmentNote(state, { fragmentId, text }) {
      const fragmentIdx = state.memorized.findIndex(
        ({ id }) => id === fragmentId
      )
      const fragment = state.memorized[fragmentIdx]
      const now = Date.now()

      if (fragment) {
        fragment.notes = [
          {
            createdAt: now,
            id: now,
            text,
            updatedAt: now,
          },
          ...fragment.notes,
        ]
        state.memorized.splice(fragmentIdx, 1, fragment)
      }
    },
    forget(state, fragmentId) {
      const idx = state.memorized.findIndex(
        ({ id }) => id === fragmentId
      )
      const fragment = state.memorized[idx]

      if (fragment) {
        state.memorized.splice(idx, 1, {
          ...state.memorized[idx],
          forgotten: true
        })
      }
    },
    setNewFragmentText(state, payload = '') {
      state.newFragmentText = payload
    },
    setSearchQuery(state, payload = '') {
      state.searchQuery = payload
    },
  }
}

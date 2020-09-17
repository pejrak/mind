import { generateMockFragments } from './generateMockFragments'
import { fragmentMatchingSearch } from './fragmentMatchingSearch'

export const Fragments = {
  state: {
    memorized: generateMockFragments(20),
    newFragmentText: '',
    newFragmentNoteText: '',
    searchIncludeForgotten: false,
    searchAllPaths: false,
    searchQuery: '',
    showNotesFor: null,
  },
  getters: {
    displayedFragments: ({
      memorized,
      searchAllPaths,
      searchIncludeForgotten,
      searchQuery,
    }, _g, rootState) => {
      const { selectedFragmentPath } = rootState.fragmentPaths

      return memorized.filter(fragment => fragmentMatchingSearch({
        fragment,
        include: (searchIncludeForgotten || !fragment.forgotten),
        path: (
          searchAllPaths
            ? null
            : selectedFragmentPath
        ),
        query: searchQuery,
      }))
    },
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
      commit('updateFragment', {
        fragmentId,
        property: 'forgotten',
        value: true,
      })
    },
    async recollectFragment({
      commit,
    }, fragmentId) {
      commit('updateFragment', {
        fragmentId,
        property: 'forgotten',
        value: undefined,
      })
    },
    async submitNewFragment({
      commit,
      rootState,
      state,
    }) {
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
    removeFragment(state, fragmentId) {
      const fragmentIdx = state.memorized.findIndex(
        ({ id }) => id === fragmentId
      )

      if (fragmentIdx >= 0) {
        state.memorized.splice(fragmentIdx, 1)
      }
    },
    showNotes(state, fragmentId = null) {
      if (state.showNotesFor !== fragmentId) {
        state.showNotesFor = fragmentId
      } else {
        state.showNotesFor = null
      }
    },
    setNewFragmentText(state, payload = '') {
      state.newFragmentText = payload
    },
    setSearchQuery(state, payload = '') {
      state.searchQuery = payload
    },
    setSearchIncludeForgotten(state, payload = false) {
      state.searchIncludeForgotten = payload
    },
    setSearchAllPaths(state, payload = false) {
      state.searchAllPaths = payload
    },
    updateFragment(state, {
      fragmentId,
      property,
      value,
    }) {
      const idx = state.memorized.findIndex(
        ({ id }) => id === fragmentId
      )
      const fragment = state.memorized[idx]

      if (fragment) {
        state.memorized.splice(idx, 1, {
          ...state.memorized[idx],
          [property]: value
        })
      }
    },
  }
}

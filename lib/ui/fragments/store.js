// import { generateMockFragments } from './generateMockFragments'
import { fragmentMatchingSearch } from './fragmentMatchingSearch'
import {
  loadMemory,
  saveMemory,
} from './actions'
import { validateFragment } from './validateFragment'
import { decode, encode } from 'js-base64'

const getCleanState = () => ({
  initiatedAt: 0,
  memorized: [],
  newFragmentNoteText: '',
  newFragmentText: '',
  removed: [],
  searchAllPaths: false,
  searchIncludeForgotten: false,
  searchQuery: '',
  showNotesFor: null,
})

export const Fragments = {
  state: getCleanState(),
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
    memoryIsEmpty: ({ memorized }) => memorized.length === 0,
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
    recall({ initiatedAt, memorized }, _getters, rootState) {
      return {
        fragments: memorized,
        initiated_at: initiatedAt,
        owner: rootState.authentication.userEmail,
        paths: rootState.fragmentPaths.available,
        removed: [],
        source: 'local',
      }
    },
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
    async load({ dispatch }) {
      const { data: { success, content } } = await loadMemory()
      console.info('load', success, content)

      if (success && content) {
        dispatch('merge', JSON.parse(decode(content)))
      }
    },
    merge({ commit }, payload) {
      console.info('merging memory', payload)
      commit('import', payload.fragments)
      commit('fragmentPaths/import', payload.paths, { root: true })
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
    async purge({ commit }) {
      console.info('purge')
      commit('reset')
      commit('fragmentPaths/reset', null, { root: true })
      return true
    },
    async save({ getters }) {
      const content = JSON.stringify({
        ...getters.recall,
        extracted_at: Date.now(),
      })
      const { data: { success } } = await saveMemory({
        content: encode(content),
        storageType: 'remoteMind',
      })
      console.info('save', { success })
      return success
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
    import(state, payload) {
      const array = payload.map(({
        created_at = Date.now(),
        createdAt = created_at,
        id,
        memorized,
        notes,
        owner,
        path,
        text,
        updated_at = createdAt,
        updatedAt = updated_at,
      }) => ({
        createdAt,
        id,
        memorized: !!memorized,
        notes,
        owner,
        path,
        updatedAt,
        text,
      })).filter(fragment => {
        return (
          validateFragment(fragment) &&
          !state.memorized.find(f => f.id === fragment.id)
        )
      })

      state.memorized = [...state.memorized, ...array]
    },
    removeFragment(state, fragmentId) {
      const fragmentIdx = state.memorized.findIndex(
        ({ id }) => id === fragmentId
      )

      if (fragmentIdx >= 0) {
        state.memorized.splice(fragmentIdx, 1)
      }
    },
    reset(state) {
      const cleanState = {
        ...getCleanState(),
        memorized: [],
      }
      Object.keys(cleanState).forEach(
        key => { state[key] = cleanState[key] }
      )
      console.info('state', state)
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

// import { generateMockFragments } from './generateMockFragments'
import { fragmentMatchingSearch } from './fragmentMatchingSearch'
import {
  loadMemory,
  saveMemory,
} from './actions'
import { validateFragment } from './validateFragment'
import { decode, encode } from 'js-base64'

// const PRIVACY_LEVELS = [
//   'personal', // Can't be shared
//   'private', // Can be shared with trustee
// ]

const DEFAULT_PRIVACY_LEVEL = 0

const getCleanState = () => ({
  initiatedAt: 0,
  lastUpdateAt: 0,
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
    canSave: (state, getters) => (
      !getters.memoryIsEmpty &&
      state.initiatedAt < state.lastUpdateAt
    ),
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
    encodedRecall: (_s, { recall }) => encode(JSON.stringify({
      ...recall,
      extracted_at: Date.now(),
    })),
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
      if (success && content) {
        dispatch('merge', JSON.parse(decode(content)))
      }
    },
    merge({ commit }, payload) {
      console.log('import', payload)
      commit('import', {
        fragments: payload.fragments,
        createdAt: payload.initiated_at,
      })
      commit('fragmentPaths/import', payload.paths, { root: true })
      commit('trusts/import', payload.trusts, { root: true })
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
      commit('reset')
      commit('fragmentPaths/reset', null, { root: true })
      return true
    },
    async save({ commit, getters }) {
      const { data: { success } } = await saveMemory({
        content: getters.encodedRecall,
        storageType: 'remoteMind',
      })
      commit('setLastUpdate')
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
    addFragment(state, {
      owner,
      path,
      privacyLevel = DEFAULT_PRIVACY_LEVEL,
      text,
    }) {
      const now = Date.now()
      const newFragment = {
        createdAt: Date.now(),
        id: now,
        notes: [],
        owner,
        path,
        privacyLevel,
        text,
        updatedAt: Date.now(),
      }
      state.memorized = [
        newFragment,
        ...state.memorized
      ]
      state.lastUpdateAt = Date.now()
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
        state.lastUpdateAt = now
      }
    },
    import(state, { fragments: payload, createdAt: importCreatedAt }) {
      const array = payload.map(({
        created_at = Date.now(),
        createdAt = created_at,
        id = createdAt,
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
      console.info('import', array.length)
      state.memorized = [...state.memorized, ...array]
      state.lastUpdateAt = state.initiatedAt = Math.max(
        importCreatedAt, state.initiatedAt
      )
    },
    removeFragment(state, fragmentId) {
      const fragmentIdx = state.memorized.findIndex(
        ({ id }) => id === fragmentId
      )
      if (fragmentIdx >= 0) {
        state.memorized.splice(fragmentIdx, 1)
        state.lastUpdateAt = Date.now()
      }
    },
    reset(state) {
      const cleanState = getCleanState()
      Object.keys(cleanState).forEach(
        key => { state[key] = cleanState[key] }
      )
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
    setLastUpdate(state, payload = state.initiatedAt) {
      state.lastUpdateAt = payload
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
        state.lastUpdateAt = Date.now()
      }
    },
  }
}

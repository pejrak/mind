// import { generateMockFragments } from './generateMockFragments'
import { fragmentMatchingSearch } from './fragmentMatchingSearch.js'
import { loadMemory, saveMemory } from './actions.js'
import { fragmentIsValid } from './fragmentIsValid.js'
import { decode, encode } from 'js-base64'
import { log } from '../utilities/log.js'
import { COLLECTION_SIGNAL } from '../peer/constants.js'

const logger = log('store:fragments')

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
    canSave: (state, getters) =>
      !getters.memoryIsEmpty &&
      state.initiatedAt < state.lastUpdateAt,
    displayedFragments: (
      {
        memorized,
        searchAllPaths,
        searchIncludeForgotten,
        searchQuery,
      },
      _g,
      rootState,
    ) => {
      const { selectedFragmentPath } = rootState.fragmentPaths

      return memorized.filter((fragment) =>
        fragmentMatchingSearch({
          fragment,
          include: searchIncludeForgotten || !fragment.forgotten,
          path: searchAllPaths ? null : selectedFragmentPath,
          query: searchQuery,
        }),
      )
    },
    onPath: ({ memorized }) => ({
      include,
      path,
    }) =>
      memorized.filter((fragment) =>
        fragmentMatchingSearch({
          fragment,
          include: include(fragment),
          path,
        }),
      ),
    encodedRecall: (_s, { recall }) =>
      encode(
        JSON.stringify({
          ...recall,
          extractedAt: Date.now(),
        }),
      ),
    memoryIsEmpty: ({ memorized }) => memorized.length === 0,
    newFragmentTextIsEmpty: ({ newFragmentText }) =>
      newFragmentText === '',
    newFragmentTextIsValid: ({ newFragmentText }) =>
      typeof newFragmentText === 'string' &&
      newFragmentText.length > 1,
    newFragmentNoteTextIsEmpty: ({ newFragmentNoteText }) =>
      newFragmentNoteText === '',
    newFragmentNoteTextIsValid: ({ newFragmentNoteText }) =>
      typeof newFragmentNoteText === 'string' &&
      newFragmentNoteText.length > 1,
    recall({ initiatedAt, memorized }, _getters, rootState) {
      return {
        fragments: memorized,
        initiatedAt,
        owner: rootState.authentication.userEmail,
        paths: rootState.fragmentPaths.available,
        removed: [],
        source: 'local',
        trusts: rootState.trusts.outgoing,
      }
    },
  },
  actions: {
    addCollected({ commit }, { fragments }) {
      logger.info('addCollected', fragments)
      fragments.filter(fragmentIsValid).forEach(f => {
        commit('addFragment', {
          ...f,
          collected: true,
        })
      })
      commit('updatedAt')
    },
    async collect(
      { dispatch, rootState, rootGetters, state },
      path = rootState.fragmentPaths.selectedFragmentPath,
    ) {
      const pathTrusts = rootGetters['trusts/outgoingOn'](path)
      for (const { recipient } of pathTrusts) {
        const [{ updatedAt } = { updatedAt: 0 }] = state.memorized
          .filter((f) => f.owner === recipient)
          .sort((a, b) => b.updatedAt - a.updatedAt)
        dispatch('collectFor', {
          path,
          recipient,
          updatedAt,
        })
      }
    },
    collectFor({ dispatch }, { path, recipient, updatedAt }) {
      logger.info('collectFor', { path, recipient, updatedAt })
      dispatch(
        'peers/sendTo',
        {
          recipient,
          path,
          signal: COLLECTION_SIGNAL,
          updatedAt,
        },
        { root: true },
      )
    },
    async forgetFragment({ commit }, fragmentId) {
      commit('updateFragment', {
        fragmentId,
        property: 'forgotten',
        value: true,
      })
    },
    async load({ dispatch }) {
      const {
        data: { success, content },
      } = await loadMemory()
      if (success && content) {
        dispatch('merge', JSON.parse(decode(content)))
      }
    },
    merge({ commit, dispatch }, payload) {
      logger.info('merge', payload)
      commit('import', {
        fragments: payload.fragments,
        createdAt: payload.initiatedAt ?? Date.now(),
        owner: payload.owner,
      })
      commit('fragmentPaths/import', payload.paths, { root: true })
      commit('trusts/import', payload.trusts, { root: true })
      dispatch('collect')
    },
    async recollectFragment({ commit }, fragmentId) {
      commit('updateFragment', {
        fragmentId,
        property: 'forgotten',
        value: undefined,
      })
    },
    async purge({ commit, dispatch }) {
      commit('reset')
      commit('fragmentPaths/reset', null, { root: true })
      dispatch('trusts/reset', null, { root: true })
      return true
    },
    async save({ getters }) {
      const {
        data: { success },
      } = await saveMemory({
        content: getters.encodedRecall,
        storageType: 'remoteMind',
      })
      return success
    },
    async submitNewFragment({ commit, rootState, state }) {
      commit('addFragment', {
        owner: rootState.authentication.userEmail,
        path: rootState.fragmentPaths.selectedFragmentPath,
        privacyLevel: 0,
        text: state.newFragmentText,
      })
      commit('setNewFragmentText')
    },
    submitNewFragmentNote({ commit, state }, fragmentId) {
      commit('addFragmentNote', {
        fragmentId,
        text: state.newFragmentNoteText,
      })
      commit('setNewFragmentText')
    },
    updateFragmentPrivacyLevel({ commit }, { fragmentId, value }) {
      commit('updateFragment', {
        fragmentId,
        property: 'privacyLevel',
        value,
      })
    },
  },
  mutations: {
    addFragment(state, {
      id,
      collected = false,
      owner,
      text,
      path,
      privacyLevel = 0,
      updatedAt,
    }) {
      const now = Date.now()
      const newFragment = {
        collected,
        createdAt: now,
        id: collected && id ? id : now,
        notes: [],
        owner,
        path,
        privacyLevel,
        text,
        updatedAt: collected && updatedAt ? updatedAt : now,
      }
      state.memorized = [newFragment, ...state.memorized]
      state.lastUpdateAt = Date.now()
    },
    addFragmentNote(state, { fragmentId, text }) {
      const fragmentIdx = state.memorized.findIndex(
        ({ id }) => id === fragmentId,
      )
      const fragment = state.memorized[fragmentIdx]
      const now = Date.now()

      if (fragment) {
        fragment.notes = [
          {
            createdAt: now,
            created_at: now,
            id: now,
            text,
            updatedAt: now,
            updated_at: now,
          },
          ...fragment.notes,
        ]
        state.memorized.splice(fragmentIdx, 1, fragment)
        state.lastUpdateAt = now
      }
    },
    import(
      state,
      {
        createdAt: importCreatedAt,
        fragments: payload,
        owner: payloadOwner,
      },
    ) {
      logger.info('import', {
        payloadOwner,
        fragments: payload.length,
      })
      const array = payload
        .map(
          ({
            collected = false,
            created_at = Date.now(),
            createdAt = created_at,
            id,
            memorized,
            notes,
            owner = payloadOwner,
            path,
            privacyLevel = 0,
            text,
            updated_at = createdAt,
            updatedAt = updated_at,
          }) => ({
            collected,
            createdAt,
            id,
            memorized: !!memorized,
            notes,
            owner,
            path,
            privacyLevel,
            updatedAt,
            text,
          }),
        )
        .filter((fragment) => {
          return (
            fragmentIsValid(fragment) &&
            !state.memorized.find((f) => f.id === fragment.id)
          )
        })
      state.memorized = [...state.memorized, ...array]
      state.lastUpdateAt = state.initiatedAt = Math.max(
        importCreatedAt,
        state.initiatedAt,
      )
    },
    removeFragment(state, fragmentId) {
      state.memorized.splice(
        state.memorized.findIndex(({ id }) => id === fragmentId),
        1,
      )
      state.lastUpdateAt = Date.now()
    },
    removeFragmentNote(state, { fragmentId, noteId }) {
      const fragmentIdx = state.memorized.findIndex(
        ({ id }) => id === fragmentId,
      )
      const fragment = state.memorized[fragmentIdx]
      const noteIdx = fragment.notes.findIndex(
        ({ id }) => id === noteId,
      )
      fragment.notes.splice(noteIdx, 1)
      state.memorized.splice(fragmentIdx, 1, fragment)
      state.lastUpdateAt = Date.now()
    },
    reset(state) {
      const cleanState = getCleanState()
      Object.keys(cleanState).forEach((key) => {
        state[key] = cleanState[key]
      })
    },
    showNotes(state, fragmentId = null) {
      if (state.showNotesFor !== fragmentId) {
        state.showNotesFor = fragmentId
      } else {
        state.showNotesFor = null
      }
    },
    setNewFragmentNoteText(state, payload = '') {
      state.newFragmentNoteText = payload
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
    updateFragment(state, { fragmentId, property, value }) {
      const idx = state.memorized.findIndex(
        ({ id }) => id === fragmentId,
      )
      const fragment = state.memorized[idx]

      if (fragment) {
        state.memorized.splice(idx, 1, {
          ...state.memorized[idx],
          [property]: value,
        })
        state.lastUpdateAt = Date.now()
      }
    },
    updatedAt(state, value = Date.now()) {
      logger.info('updatedAt', { value })
      state.lastUpdateAt = value
    },
  },
}

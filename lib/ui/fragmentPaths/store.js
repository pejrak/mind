import { capitaliseFirstLetter } from '../../format/strings.js'
import { log } from '../utilities/log.js'
import { TEMPORARY_PATH_LABEL } from './constants.js'

const pathJoiner = ' ∙ '
const temporaryFragmentPath = [TEMPORARY_PATH_LABEL]
const logger = log('FragmentPathsStore')

export const FragmentPaths = {
  state: {
    available: [temporaryFragmentPath],
    selectedFragmentPath: temporaryFragmentPath,
  },
  getters: {
    availablePathOptions: ({ available }) => available.map(path => ({
      text: path.map(p => capitaliseFirstLetter(p)).join(pathJoiner),
      value: path.join('-'),
    })),
    moreThanOneFragmentPath: ({ available }) => (available.length > 1),
    selectedFragmentPathName: ({
      selectedFragmentPath
    }) => selectedFragmentPath
      .join('-'),
    selectedFragmentPathTitle: ({
      selectedFragmentPath
    }) => selectedFragmentPath
      .map(capitaliseFirstLetter)
      .join(pathJoiner),
  },
  mutations: {
    createFragmentPath(state, payload) {
      state.available = [
        payload,
        ...state.available
      ]
    },
    import(state, payload) {
      state.available = [
        ...state.available,
        ...payload,
      ].map(p => p.join('::')).reduce(
        (uniq, p) => uniq.includes(p)
          ? uniq
          : uniq.concat([p]), []
      ).map(p => p.split('::'))
    },
    reset(state) {
      state.available = [temporaryFragmentPath]
      state.selectedFragmentPath = temporaryFragmentPath
    },
    select(state, payload) {
      logger.info('selectFragmentPath', payload)
      state.selectedFragmentPath = payload.split('-')
    },
  },
  actions: {
    selectFragmentPath({ commit, dispatch, state }, payload) {
      commit('select', payload)
      dispatch(
        'fragments/collect',
        state.selectedFragmentPath, { root: true }
      )
    },
  }
}

import { capitaliseFirstLetter } from '../../format/strings.js'

const pathJoiner = ' ∙ '
const temporaryFragmentPathName = 'temporary'
const temporaryFragmentPath = [temporaryFragmentPathName]

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
    selectFragmentPath(state, payload) {
      state.selectedFragmentPath = payload.split('-')
    },
  },
}

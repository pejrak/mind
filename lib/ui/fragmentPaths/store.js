import { capitaliseFirstLetter } from '../../format/strings'

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
    selectFragmentPath(state, payload) {
      state.selectedFragmentPath = payload.split('-')
    },
    createFragmentPath(state, payload) {
      state.available = [
        payload,
        ...state.available
      ]
    }
  },
}

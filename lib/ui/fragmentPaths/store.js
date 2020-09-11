import { capitaliseFirstLetter } from "../../format/strings"

const pathJoiner = ' ∙ '

export const FragmentPaths = {
  state: {
    available: [
      [ 'temporary' ],
    ],
    selectedFragmentPath: 'temporary'
  },
  getters: {
    availablePathOptions: ({ available }) => available.map(path => ({
      text: path.map(p => capitaliseFirstLetter(p)).join(pathJoiner),
      value: path.join('-'),
    })),
    selectedFragmentPathTitle: ({
      selectedFragmentPath
    }) => selectedFragmentPath
      .split('-')
      .map(capitaliseFirstLetter)
      .join(pathJoiner),
  },
  mutations: {
    selectFragmentPath(state, payload) {
      state.selectedFragmentPath = payload
    }
  },
}
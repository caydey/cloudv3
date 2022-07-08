
// initial state
const state = {
  selection: [], // selected items (highlighted in blue)
  contents: [], // array of items
  action: '', // copy cut
}

// getters
const getters = {
  contents(state) {
    return state.contents
  },
  action(state) {
    return state.action
  },
  selection(state) {
    return state.selection
  },
  hasContents(state) {
    return (state.contents.length > 0)
  },
  selectionIncludes: ({ selection }) => (itemPath) => {
    for (let i = 0; i < selection.length; i++) {
      if (selection[i].path === itemPath) {
        return true
      }
    }
    return false
  },
  selectionOnlyFiles({ selection }) {
    for (let i = 0; i < selection.length; i++) {
      if (selection[i].type !== 'file') {
        return false
      }
    }
    return true
  },
  contentsIncludes: ({ contents }) => (itemPath) => {
    for (let i = 0; i < contents.length; i++) {
      if (contents[i].path === itemPath) {
        return true
      }
    }
    return false
  }
}

// selection is objects
// but contents is path

// mutations
const mutations = {
  setSelection(state, selection) {
    state.selection = selection
  },
  setAction(state, action) {
    state.action = action
    state.contents = state.selection
    // state.contents = state.selection.map((select) => select.path)
    state.selection = []
  },
  clear(state) {
    state.action = ''
    state.contents = []
  },
  clearSelection(state) {
    state.selection = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
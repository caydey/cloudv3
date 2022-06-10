
// initial state
const state = {
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
  hasContents(state) {
    return (state.contents.length > 0)
  }
}

// mutations
const mutations = {
  setContents(state, contents) {
    state.contents = contents
  },
  setAction(state, action) {
    state.action = action
  },
  clear(state) {
    state.action = ''
    state.contents = []
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
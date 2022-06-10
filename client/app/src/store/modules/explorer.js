
// initial state
const state = {
  data: {},
  path: '',
  loading: true,
  error: ''
}


// getters
const getters = {
  data(state) {
    return state.data
  },
  path(state) {
    return state.path
  },
  loading(state) {
    return state.loading
  },
  error(state) {
    return state.error
  }
}
// actions
let loadingTimer
const LOADING_TRIGGER_TIMEOUT = 500
const actions = {
  dataRequested({ commit }) {
    clearTimeout(loadingTimer) // if data requested called twice before response shit goes down, this fixes that
    loadingTimer = setTimeout(() => {
      commit('setLoading', true)
    }, LOADING_TRIGGER_TIMEOUT)
  },
  dataRecieved({ commit }) { // context.commit
    clearTimeout(loadingTimer)
    commit('setLoading', false)
  }
}

// mutations
const mutations = {
  setPath(state, path) {
    state.path = path
  },
  setData(state, data) {
    state.data = data
    state.error = ''
  },
  setLoading(state, loading) {
    state.loading = loading
  },
  setError(state, error) {
    state.error = error
    state.data = {}
  }
}

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
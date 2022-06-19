
// initial state
const state = {
  zoomLevel: Number(localStorage.getItem('ZOOM_LEVEL')),
  sortOrder: localStorage.getItem('SORT_ORDER'),
  sortDirection: localStorage.getItem('SORT_DIRECTION')
}


// getters
const getters = {
  zoomLevel(state) {
    return state.zoomLevel
  },
  sortOrder(state) {
    return state.sortOrder
  },
  sortDirection(state) {
    return state.sortDirection
  },
}

// mutations
const mutations = {
  incrementZoom(state, increment) {
    const newLevel = state.zoomLevel + increment
    // out of bounds
    if (2 < newLevel || newLevel < -2) {
      return
    }

    localStorage.setItem('ZOOM_LEVEL', newLevel)
    state.zoomLevel = newLevel
  },
  resetZoom(state) {
    state.zoomLevel = 0
  },
  setSortOrder(state, sortOrder) {
    localStorage.setItem('SORT_ORDER', sortOrder)
    state.sortOrder = sortOrder
  },
  setSortDirection(state, sortDirection) {
    localStorage.setItem('SORT_DIRECTION', sortDirection)
    state.zoomLevel = sortDirection
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
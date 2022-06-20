
// initial state
const state = {
  zoomLevel: JSON.parse(localStorage.getItem('ZOOM_LEVEL') || '0'),
  sortField: JSON.parse(localStorage.getItem('SORT_FIELD') || '"name"'),
  sortAscending: JSON.parse(localStorage.getItem('SORT_ASCENDING') || 'true'),
  sortFoldersFirst: JSON.parse(localStorage.getItem('SORT_FOLDERS_FIRST') || 'true')
}


// getters
const getters = {
  zoomLevel(state) {
    return state.zoomLevel
  },
  sortField(state) {
    return state.sortField
  },
  sortAscending(state) {
    return state.sortAscending
  },
  sortFoldersFirst(state) {
    return state.sortFoldersFirst
  }
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
  setSortOrder(state, sortField) {
    localStorage.setItem('SORT_FIELD', sortField)
    state.sortField = sortField
  },
  setSortDirection(state, sortAscending) {
    localStorage.setItem('SORT_ASCENDING', sortAscending)
    state.zoomLevel = sortAscending
  },
  setSortFoldersFirst(state, sortFoldersFirst) {
    localStorage.setItem('SORT_FOLDERS_FIRST', JSON.stringify(sortFoldersFirst))
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
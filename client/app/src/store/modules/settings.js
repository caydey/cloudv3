const Cookies = require('js-cookie')

// initial state
const state = {
  zoomLevel: JSON.parse(localStorage.getItem('ZOOM_LEVEL') || '0'),

  sortField: localStorage.getItem('SORT_FIELD') || 'name',
  sortAscending: JSON.parse(localStorage.getItem('SORT_ASCENDING') || 'true'),
  sortFoldersFirst: JSON.parse(localStorage.getItem('SORT_FOLDERS_FIRST') || 'true'),

  titleShowHeader: JSON.parse(localStorage.getItem('TITLE_SHOW_HEADER') || 'true'),
  titleFullPath: JSON.parse(localStorage.getItem('TITLE_FULL_PATH') || 'false'),

  accessToken: Cookies.get('Access_Token')
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
  },
  titleShowHeader(state) {
    return state.titleShowHeader
  },
  titleFullPath(state) {
    return state.titleFullPath
  },
  accessToken(state) {
    return state.accessToken
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
    localStorage.setItem('ZOOM_LEVEL', 0)
    state.zoomLevel = 0
  },

  setSortField(state, sortField) {
    localStorage.setItem('SORT_FIELD', sortField)
    state.sortField = sortField
  },
  setSortAscending(state, sortAscending) {
    localStorage.setItem('SORT_ASCENDING', sortAscending)
    state.sortAscending = sortAscending
  },
  toggleSortFoldersFirst(state) {
    const sortFoldersFirst = !state.sortFoldersFirst
    localStorage.setItem('SORT_FOLDERS_FIRST', sortFoldersFirst)
    state.sortFoldersFirst = sortFoldersFirst
  },

  setTitleShowHeader(state, titleShowHeader) {
    localStorage.setItem('TITLE_SHOW_HEADER', titleShowHeader)
    state.titleShowHeader = titleShowHeader
  },
  setTitleFullPath(state, titleFullPath) {
    localStorage.setItem('TITLE_FULL_PATH', titleFullPath)
    state.titleFullPath = titleFullPath
  },
  setAccessToken(state, accessToken) {
    Cookies.set('Access_Token', accessToken, {
      expires: 5_000, // expires in 5000 days """permanent"""
      sameSite: "strict"
    })
    state.accessToken = accessToken
  }
}

export default {
  namespaced: true,
  state,
  getters,
  mutations
}
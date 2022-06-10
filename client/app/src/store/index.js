import { createStore } from 'vuex'
import explorer from './modules/explorer'
import clipboard from './modules/clipboard'

import cloudSocket from './plugins/cloud'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    explorer,
    clipboard
  },
  strict: debug,
  plugins: [
    cloudSocket()
  ]
})

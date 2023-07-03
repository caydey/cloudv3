import { createStore } from 'vuex'
import explorer from './modules/explorer'
import clipboard from './modules/clipboard'
import settings from './modules/settings'
import cloudSocket from './plugins/cloud'
import cloudCache from './plugins/cloudCache'

const debug = process.env.NODE_ENV !== 'production'

export default createStore({
  modules: {
    explorer,
    clipboard,
    settings
  },
  strict: debug,
  plugins: [
    cloudSocket(),
    cloudCache()
  ]
})

const path = require('path')

const { DATA_ROOT } = require('../config.js')

module.exports = class {
  constructor (givenPath, type) {
    if (type === 'SYSTEM') {
      this.system = givenPath
      this.virtual = givenPath.replace(DATA_ROOT, '')
    } else {
      const sterilePath = path.join('/', givenPath)
      this.virtual = sterilePath
      this.system = path.join(DATA_ROOT, sterilePath)
    }
  }
}

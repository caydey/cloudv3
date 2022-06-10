const fs = require('fs-extra');
const path = require('path');
const { DATA_ROOT } = require('../config.js')
const checkDiskSpace = require('check-disk-space').default

// only allow checkDiskSpace to be run at most once every minute
// by caching the output and updating it after the 'getSize' method
// is called
class CloudSizeMonitor {
  static #TIMEOUT = 60*1_000 // 1 minute
  static #lastQuery = 0
  static #lastSize = { free: 0, total: 0 }
  static getStats() {
    if (this.#lastQuery < (Date.now()-this.#TIMEOUT))
      this.#updateSize()

    return this.#lastSize
  }
  static #updateSize() {
    this.#lastQuery = Date.now()
    checkDiskSpace(DATA_ROOT).then((diskSpace) => {
      this.#lastSize = {
        free: diskSpace.free,
        total: diskSpace.size
      }
    })
  }
}
CloudSizeMonitor.getStats() // force update

exports.getCloudDiskStats = function() {
  return CloudSizeMonitor.getStats()
}


class CloudPath {
  constructor(givenPath, type) {
    if (type === 'SYSTEM') {
      this.system = givenPath
      this.virtual = givenPath.replace(DATA_ROOT, "")
    } else {
      let sterilePath = path.join('/', givenPath)
      this.virtual = sterilePath
      this.system = path.join(DATA_ROOT, sterilePath)
    }
  }
}
exports.CloudPath = CloudPath



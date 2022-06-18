const checkDiskSpace = require('check-disk-space').default

const { DATA_ROOT, HIDE_DISK_SIZE } = require('../config.js')

// only allow checkDiskSpace to be run at most once every minute
// by caching the output and updating it after the 'getSize' function
// is called

const TIMEOUT = 1 * 60 * 1_000 // 1 minute
let lastQuery = 0
let lastSize = { free: 0, total: 0 }

function updateSize () {
  lastQuery = Date.now()
  checkDiskSpace(DATA_ROOT).then((diskSpace) => {
    lastSize = {
      free: diskSpace.free,
      total: diskSpace.size
    }
  })
}
updateSize() // force update

const getCloudSizeStats = function () {
  if (HIDE_DISK_SIZE) {
    return { free: -1, total: -1 }
  }
  if (lastQuery < (Date.now() - TIMEOUT)) {
    updateSize()
  }

  return lastSize
}
exports.getCloudSizeStats = getCloudSizeStats

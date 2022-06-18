const express = require('express')
const fs = require('fs-extra')
const path = require('path')
const mime = require('./mimetypes')
const CloudPath = require('../models/CloudPath.js')

const { STATIC_HOST } = require('../config.js')
const { getCloudSizeStats } = require('../models/CloudSizeMonitor.js')
const translateErrorCode = require('../helpers/translateErrorCode.js')

const router = express.Router()

router.post('/', (req, res) => { // ?path
  const givenPath = req.body.path
  if (!givenPath) {
    return res.status(400).send({
      success: false,
      message: 'path not defined'
    })
  }

  const cloudPath = new CloudPath(givenPath)

  exploreApi(cloudPath, (response) => {
    res.status(200).send(response)
  })
})
exports.router = router

const exploreApi = function (cloudPath, callback) {
  // check explore path is valid, path exists and we have read permissions
  validateExplorePath(cloudPath, (validateErrMessage) => {
    if (validateErrMessage) {
      const response = {
        success: false,
        message: validateErrMessage
      }
      return callback(response)
    }

    explorePath(cloudPath, (exploreErrMessage, data) => {
      // exploreErrMessage "should" always be null as any errors "should" be
      // caught in validateExplorePath function
      if (exploreErrMessage) {
        const response = {
          success: false,
          message: exploreErrMessage
        }
        return callback(response)
      }
      const response = {
        success: true,
        data
      }
      callback(response)
    })
  })
}
// we use this function in websockets also
exports.exploreApi = exploreApi

function validateExplorePath (cloudPath, callback) {
  // path exists
  fs.access(cloudPath.system, fs.W_OK, (err) => {
    if (err) {
      const errMessage = translateErrorCode(err.code)
      return callback(errMessage)
    }
    callback(undefined)
  })
}
exports.validateExplorePath = validateExplorePath

function explorePath (cloudPath, callback) {
  // get file stats
  const fsStats = getFileStats(cloudPath)

  // if given path is not a directory just return its stats
  if (fsStats.type === 'file') {
    return callback(undefined, fsStats)
  }

  // given path is directory add extra fields [children,free,total]
  fs.readdir(cloudPath.system, (err, files) => {
    if (err) {
      const errMessage = translateErrorCode(err.code)
      return callback(errMessage)
    } // error

    const children = []
    let childrenSize = 0
    if (files) { // not empty directory
      files.forEach(file => {
        const filePath = path.join(cloudPath.system, file)
        // when a file is deleted we somehow still reach here
        if (fs.existsSync(filePath)) {
          const childCloudPath = new CloudPath(filePath, 'SYSTEM')
          const childCloudStats = getFileStats(childCloudPath)
          childrenSize += childCloudStats.size // add to json
          children.push(childCloudStats) // add to json
        }
      })
    }
    fsStats.children = children
    fsStats.size = childrenSize
    // disk size stats
    const diskStats = getCloudSizeStats()
    fsStats.free = diskStats.free
    fsStats.total = diskStats.total

    callback(undefined, fsStats)
  }) // /readdir
}

function getFileStats (cloudPath) {
  const fsStats = fs.statSync(cloudPath.system)
  let type = 'file'
  let location = STATIC_HOST + cloudPath.virtual
  if (fsStats.isDirectory()) {
    type = 'directory'
    // only show location (http://localhost:3000/static/FILE) for files
    location = undefined
  }
  const stats = {
    path: cloudPath.virtual,
    name: path.basename(cloudPath.virtual) || '/',
    location,
    type,
    size: fsStats.size,
    modified: fsStats.mtime,
    mime: mime.lookup(cloudPath.system) || 'unknown'
  }
  return stats
}

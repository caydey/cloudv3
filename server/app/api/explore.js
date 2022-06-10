const express = require('express')

const { STATIC_HOST } = require('../config.js')

const fs = require('fs-extra')
const path = require('path')
const mime = require('mime-types')
const { CloudPath, getCloudDiskStats } = require('../models/cloud_volume.js')

const translateErrorCode = require('../helpers/translateErrorCode.js')

var router = express.Router()

router.post('/', (req, res) => {  // ?path
  const givenPath = req.body.path
  if (!givenPath) {
    return res.status(400).send({
      'success': false,
      'message': 'path not defined'
    })
  }
  
  const cloudPath = new CloudPath(givenPath)
  
  validateExplorePath(cloudPath, (errorMessage) => {
    if (errorMessage) {
      return res.status(200).send({
        'success': false,
        'message': errorMessage
      })
    }
   
    explorePath(cloudPath, (err, data) => {
      if (err) {
        return res.status(500).send({
          'success': false,
          'message': 'internal server error'
        })
      }
      res.status(200).send({
        'success': true,
        'data': data
      })
    }) 
  })
});
exports.router = router;


const validateExplorePath = function (cloudPath, callback) {
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

const explorePath = function(cloudPath, callback) {
  // get file stats
  let fsStats = getFileStats(cloudPath)

  // if given path is not a directory just return its stats
  if (fsStats.type === 'file')
    return callback(undefined, fsStats)

  // given path is directory add extra fields [children,free,total]
  fs.readdir(cloudPath.system, (err, files) => {
    if (err) // error
      return callback(err)

    let children = []
    let childrenSize = 0
    if (files) { // not empty directory
      files.forEach(file => {
        let filePath = path.join(cloudPath.system, file)
        if (fs.existsSync(filePath)) { // when a file is deleted we somehow still reach here
          let childCloudPath = new CloudPath(filePath, 'SYSTEM')
          let childCloudStats = getFileStats(childCloudPath)
          childrenSize += childCloudStats.size // add to json
          children.push(childCloudStats) // add to json
        } 
      })
    }
    fsStats['children'] = children
    fsStats['size'] = childrenSize
    // disk size stats
    let diskStats = getCloudDiskStats()
    fsStats['free'] = diskStats.free
    fsStats['total'] = diskStats.total

    callback(undefined, fsStats)
  }) // /readdir
}
exports.explorePath = explorePath


function getFileStats(cloudPath) {
  let fsStats = fs.statSync(cloudPath.system)
  let type = 'file'
  let location = STATIC_HOST+cloudPath.virtual
  if (fsStats.isDirectory()) {
    type = 'directory'
    // only show location (http://localhost:3000/static/FILE) for files
    location = undefined
  }
  var stats = {
    'path': cloudPath.virtual,
    'name': path.basename(cloudPath.virtual) || '/',
    'location': location,
    'type': type,
    'size': fsStats.size,
    'modified': fsStats.mtime,
    'mime': mime.lookup(cloudPath.system) || 'unknown'
  }
  return stats
}
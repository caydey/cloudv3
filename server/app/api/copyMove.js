const express = require('express')
const fs = require('fs-extra')
const path = require('path')

const translateErrorCode = require('../helpers/translateErrorCode.js')
const CloudPath = require('../models/CloudPath.js')

const router = express.Router()

router.post('/', (req, res) => { // ?path ?dest
  const fromPath = req.body.path
  const destPath = req.body.dest
  if (typeof fromPath !== 'string' || typeof destPath !== 'string') {
    return res.status(400).send({
      success: false,
      message: 'path or dest not defined'
    })
  }

  const fromCloudPath = new CloudPath(fromPath)
  if (!fs.existsSync(fromCloudPath.system)) {
    return res.status(200).send({
      success: false,
      message: 'Path does not exist',
      data: { path: fromPath, dest: destPath }
    })
  }
  const destCloudPath = new CloudPath(destPath)
  let sysDestPath = destCloudPath.system

  // mv file folder/ -> mv file folder/file
  if (
    fs.existsSync(destCloudPath.system) &&
    fs.statSync(destCloudPath.system).isDirectory()) {
    sysDestPath = path.join(destCloudPath.system, path.basename(fromCloudPath.system))
  }

  const errorHandler = (err) => {
    if (err) {
      // api response
      const errMessage = translateErrorCode(err.code)
      return res.status(200).send({
        success: false,
        message: errMessage,
        data: { path: fromPath, dest: destPath }
      })
    }
    res.status(200).send({
      success: true
    })
  }

  if (req.action === 'MOVE') {
    fs.move(fromCloudPath.system, sysDestPath, { overwrite: true }, errorHandler)
  } else if (req.action === 'COPY') {
    fs.copy(fromCloudPath.system, sysDestPath, errorHandler)
  }
})

exports.router = router

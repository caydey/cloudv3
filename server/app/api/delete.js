const express = require('express')
const fs = require('fs-extra')

const CloudPath = require('../models/CloudPath.js')
const translateErrorCode = require('../helpers/translateErrorCode.js')

const router = express.Router()

router.post('/', (req, res) => { // ?path?recursive
  const givenPath = req.body.path
  const recursiveFlag = req.body.recursive
  if (typeof givenPath !== 'string') {
    return res.status(400).send({
      success: false,
      message: 'path not defined'
    })
  }
  const cloudPath = new CloudPath(givenPath)
  if (!fs.existsSync(cloudPath.system)) {
    return res.status(200).send({
      success: false,
      message: 'path does not exist',
      data: { path: cloudPath.virtual }
    })
  }

  // dont allow deletion of the root directory
  if (cloudPath.virtual === '/') {
    return res.status(200).send({
      success: false,
      message: 'refusing to delete root directory'
    })
  }

  if (!recursiveFlag) {
    if (fs.statSync(cloudPath.system).isDirectory()) {
      return res.status(400).send({
        success: false,
        message: 'refusing to delete directory without having a recursive=true paramater',
        data: { path: cloudPath.virtual }
      })
    }
  }

  fs.remove(cloudPath.system, (err) => {
    if (err) {
      const errMessage = translateErrorCode(err.code)
      return res.status(200).send({
        success: false,
        message: errMessage
      })
    }
    res.status(200).send({
      success: true
    })
  })
})

exports.router = router

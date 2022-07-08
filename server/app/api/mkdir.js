const express = require('express')
const fs = require('fs')
const path = require('path')
const translateErrorCode = require('../helpers/translateErrorCode.js')

const CloudPath = require('../models/CloudPath.js')

const router = express.Router()

router.post('/', (req, res) => { // ?path
  const givenPath = req.body.path
  if (typeof givenPath !== 'string') {
    return res.status(400).send({
      success: false,
      message: 'path not defined'
    })
  }

  const cloudPath = new CloudPath(givenPath)

  if (!fs.existsSync(path.dirname(cloudPath.system))) {
    return res.status(200).send({
      success: false,
      message: 'parent directory not found',
      data: { path: givenPath }
    })
  }

  if (fs.existsSync(cloudPath.system)) {
    return res.status(200).send({
      success: false,
      message: 'folder/file already exists at path',
      data: { path: givenPath }
    })
  }

  fs.mkdir(cloudPath.system, { recursive: true }, (err) => {
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

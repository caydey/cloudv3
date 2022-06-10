const express = require('express')
const { CloudPath } = require('../models/cloud_volume.js')
const fs = require('fs-extra')
const path = require('path')

var router = express.Router()

const translateErrorCode = require('../helpers/translateErrorCode.js')


router.post('/', (req, res) => {  // ?path?recursive
  const givenPath = req.body.path
  const recursiveFlag = req.body.recursive
  if (!givenPath) {
    return res.status(400).send({
      'success': false,
      'message': 'path not defined'
    })
  }
  const cloudPath = new CloudPath(givenPath)
  if (!fs.existsSync(cloudPath.system)) {
    return res.status(200).send({
      'success': false,
      'message': 'path does not exist',
      'data': { 'path': givenPath }
    })
  }

  if (!recursiveFlag) {
    if (fs.statSync(cloudPath.system).isDirectory()) {
      return res.status(400).send({
        'success': false,
        'message': 'refusing to delete directory without having a recursive=true paramater',
        'data': { 'path': givenPath }
      })
    }
  }

  fs.remove(cloudPath.system, (err) => {
    if (err) {
      const errMessage = translateErrorCode(err.code)
      return res.status(200).send({
        'success': false,
        'message': errMessage
      })
    }
    res.status(200).send({
      'success': true
    })
  })
});


exports.router = router;

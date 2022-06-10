const express = require('express')

const fs = require('fs')
const path = require('path')
const multer = require('multer')
const { CloudPath } = require('../models/cloud_volume.js')

let router = express.Router()

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, req.saveCloudPath.system)
  },
  filename: (req, file, callback) => { 
    callback(null, file.originalname);   
  }
});

let upload = multer({ storage: storage })


router.post(
  '/',
  // middleware 1 - authenticate 'path' paramater
  (req, res, next) => { // ?path
    const givenPath = req.query.path
    // path is a directory
    if (!givenPath) {
      return res.status(400).send({
        'success': false,
        'message': 'path paramater required'
      })
    }
    let cloudPath = new CloudPath(givenPath)
    
    // check path exists
    if (!fs.existsSync(cloudPath.system)) {
      return res.status(200).send({
        'success': false,
        'message': 'given path not found'
      })
    }

    // check path is a folder
    if (!fs.statSync(cloudPath.system).isDirectory()) {
      return res.status(200).send({
        'success': false,
        'message': 'given path is not a directory'
      })
    }

    req.saveCloudPath = cloudPath // accessed by multer

    next()
  },
  // middleware 2 - multer
  upload.single('files'),
  // middleware 3 - response
  (req, res) => {
    return res.status(200).send({
      'success': true,
    })
  }
)

exports.router = router
const apiDelete = require('./api/delete.js')
const apiCopyMove = require('./api/copyMove.js')
const apiMkdir = require('./api/mkdir.js')
const apiUpload = require('./api/upload.js')

const accessController = require('./middleware/accessController.js')

const routes = (route) => {
  route.use(
    '/api/mkdir',
    accessController,
    apiMkdir.router
  )

  route.use(
    '/api/delete',
    accessController,
    apiDelete.router
  )

  route.use(
    '/api/upload',
    accessController,
    apiUpload.router
  )

  route.use('/api/move',
    [
      (req, res, next) => {
        req.action = 'MOVE'
        next()
      },
      accessController
    ],
    apiCopyMove.router
  )

  route.use('/api/copy',
    [
      (req, res, next) => {
        req.action = 'COPY'
        next()
      },
      accessController
    ],
    apiCopyMove.router
  )
}

module.exports = routes
